const User = require('../model/users_model.js');
const Task = require('../model/task_model.js');
const ForgotUser = require('../model/forgot_user_model.js');
const queue = require('../config/kue.js');
const passwordMailerWorker = require('../workers/password-email-worker.js');
const crypto = require('crypto');
const path = require('path');
const fs = require("fs");

module.exports.signin = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.render('user-signin');
    }
    else
        res.redirect('/home');
};

module.exports.signup = (req, res) => {
    if (!req.isAuthenticated())
        return res.render('user-signup');
    else
        res.redirect('/home');
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) console.log(err);
        else {
            req.flash("success", "Logged out successfully");
            return res.redirect("/");
        }
    });
}

module.exports.settings = (req, res) => {
    return res.render('settings');
}
module.exports.profile = (req, res) => {
    return res.render('profile');
};
module.exports.isFileExists = async (req, res) => {
    let user = await User.findById(req.user._id);
    if (user.avatar) {
        try {
            fs.accessSync(path.join(__dirname, "..", user.avatar), fs.constants.F_OK);
            console.log("file exists");
            return true;
        }
        catch {
            console.log("file does not exist");
            return false;
        }
    }
    else
        return false;
}
module.exports.create = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            try {
                user = await User.create(req.body);
                user.avatar = "../images/user.jpg";
                await user.save();
                req.flash('success', 'User created successfully!');
                return res.redirect('/user/signin');
            } catch (err) {
                // console.log('error in creating user while signing up', err);
                return res.render('error', {
                    message: "error in creating user while signing up",
                    error: err
                });
            }
        } else {
            req.flash("error", "User already exists!");
            return res.redirect('back');
        }
    } catch (err) {
        // console.log('error in finding user in signing up');
        return res.render('error', {
            message: "error in finding user in signing up",
            error: err
        })
    }
}

module.exports.update = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (req.file) {
            if (await this.isFileExists(req, res)) {
                fs.unlinkSync(path.join(__dirname, "..", user.avatar));
            }
            user.avatar = User.avatarPath + '/' + req.file.filename;
            await user.save();
        }
        else {
            // console.log("File does not exist");
            res.status(500).json({ message: "File does not exist" });
        }
        await User.findByIdAndUpdate(req.user._id, req.body);
        res.locals.user = await User.findById(req.user._id);
        return res.status(200).json({
            data: {
                src: user.avatar,
                name: req.body.name
            },
            message: "updated successfully"
        });
    } catch (err) {
        // console.error(err);
        return res.status(500).json({ message: "Some error has occurred!!" });
    }
}

module.exports.authorize = (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect('/home');
}

module.exports.forgotPassword = (req, res) => {
    return res.render('forgot-password');
}

module.exports.indentify = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash("error", "User does not exist!");
            return res.redirect("back");
        }
        else {
            req.flash("success", "User verified successfully!");
            let forgotUser = await ForgotUser.findOne({ email: req.body.email });
            if (!forgotUser) {
                forgotUser = await ForgotUser.create({
                    email: req.body.email,
                    token: crypto.randomBytes(20).toString('hex'),
                    valid: true
                });

            }
            else {
                forgotUser.token = crypto.randomBytes(20).toString('hex');
                forgotUser.valid = true;
                await forgotUser.save();
            }
            let job = queue.create('emails', forgotUser).save(function (err) {
                if (err) {
                    // console.log("error in sending to the queue", err);
                    return res.render('error', {
                        message: "error in sending to the queue",
                        error: err
                    });
                }
                // console.log("job enqueued", job.id);
            })

            return res.redirect('varified/' + user._id);
        }
    } catch (err) {
        // console.log(err);
        return res.render('error', {
            message: "some error has occurred!!!",
            error: err
        })
    }
}

module.exports.varified = async (req, res) => {
    let user = await User.findById(req.params.id);
    return res.render('varified', {
        user: user
    }
    );
}

module.exports.resetPassword = async (req, res) => {
    let forgotUser = await ForgotUser.findOne({ token: req.params.token });
    if (!forgotUser) {
        req.flash("error", "Something went wrong, try again");
        res.redirect('/user/signin');
    }
    else {
        if (forgotUser.valid) {
            forgotUser.valid = false;
            await forgotUser.save();
            return res.render('reset-password', {
                token: req.params.token
            });
        }
        return req.flash("error", "Your token has expired, try again");
    }
}

module.exports.updatePassword = async (req, res) => {
    let forgotUser = await ForgotUser.findOne({ token: req.body.token });
    if (!forgotUser) {
        req.flash("error", "User not found");
        res.redirect('/user/signin');
    }
    else {
        let user = await User.findOne({ email: forgotUser.email });
        if (req.body.password != req.body.confirmPassword) {
            req.flash("error", "Password does not match");
            res.redirect('back');
        }
        else {

            user.password = req.body.password;
            await user.save();
            req.flash("success", "Password changed successfully");
            res.redirect('/user/signin');
        }
    }
}

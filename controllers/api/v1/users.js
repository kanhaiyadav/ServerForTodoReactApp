const User = require('../../../model/users_model.js');
const Task = require('../../../model/task_model.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.createSession = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if(!user) {
            return res.status(422).json({
                message: "User does not exist"
            });
        }
        if (user.password != req.body.password) {
            return res.status(422).json({
                message: "Invalid username or password",
            });
        }
        return res.status(200).json({
            message: "Signed in successfully",
            data: {
                user: user,
                token: "Bearer " + jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1d' })
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports.register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(422).json({
                message: "User already exists"
            });
        }
        if (req.body.password != req.body.confirmPassword) {
            console.log(req.body);
            return res.status(422).json({
                message: "Passwords do not match"
            });
        }
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        return res.status(200).json({
            data: {
                user: user
            },
            message: "User created successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports.verify = async (req, res) => {
    try {
        return res.status(200).json({
            user: req.user,
            message: "Verified"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports.change_username = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        user.name = req.body.username;
        await user.save();
        return res.status(200).json({
            data: {
                name: req.body.username
            },
            message: "Username changed successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Failed to change username"
        });
    }
}

module.exports.delete = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.tasks.forEach(async (taskid) => {
            await Task.findByIdAndDelete(taskid);
        });
        await User.findByIdAndDelete(req.user._id);
        return res.status(200).json({
            message: "User deleted successfully",
            data: {
                _id: req.params.id
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Failed to delete the user"
        });
    }
}
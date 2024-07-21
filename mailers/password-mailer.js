const nodeMailer = require("../config/nodemailer");


module.exports.resetPassword = (forgotUser) => {
    let htmlString = nodeMailer.renderTemplate({ forgotUser: forgotUser }, '/password/reset_password.ejs');
    nodeMailer.transporter.sendMail({
        from: 'kanhaiya.yadav.ds26@heritageit.edu.in',
        to: forgotUser.email,
        subject: "Reset Password",
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log("Error in sending mail", err);
            return;
        }
        console.log("message sent", info);
        return;
    });
}
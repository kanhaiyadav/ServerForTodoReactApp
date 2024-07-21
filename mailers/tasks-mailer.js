const nodeMailer = require("../config/nodemailer");


exports.newTask = (task) => {
    let htmlString = nodeMailer.renderTemplate({ task: task }, '/task/new_task.ejs');
    nodeMailer.transporter.sendMail({
        from: 'kanhaiya.yadav.ds26@heritageit.edu.in',
        to: task.user.email,
        subject: "New Task Created",
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
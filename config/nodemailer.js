const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

smtp = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, //indicates we are using TLS
    secure: false, //true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
}

//This part defines how the communication will take place
let transporter = nodemailer.createTransport(smtp);

//This part says where will the ejs file when a html email is sent.
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) {
                console.log('Error in rendering template', err);
                return;
            }
            mailHTML = template;
        }
    );
    return mailHTML;
};



module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

//path for production logs
const logDirectory = path.join(__dirname, '../production_logs');

//checking if the directory for logs already exists if it does not then create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

//access logs are the logs which will be create whenever a request is made to the server
//here 'access.log' , the first argument is the name of the file which in which access logs will be stored
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',   //interval for deletion
    path: logDirectory
})

//note in the developement mode credential might not need to be hidden but i have to hide it here because i am pushing my code to git hub
const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: process.env.TODO_SESSION_COOKIE_KEY,
    db: 'tasks_db',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587, //indicates we are using TLS
        secure: false, //true for 465, false for other ports
        auth: {
            user: process.env.TODO_SMTP_USER,
            pass: process.env.TODO_SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    google_client_id: process.env.TODO_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.TODO_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.TODO_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.TODO_JWT_SECRET,
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}

const production = {
    name: 'production',
    asset_path: process.env.TODO_ASSETS_PATH,
    session_cookie_key: process.env.TODO_SESSION_COOKIE_KEY,
    db: process.env.BESOCIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587, //indicates we are using TLS
        secure: false, //true for 465, false for other ports
        auth: {
            user: process.env.TODO_SMTP_USER,
            pass: process.env.TODO_SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    google_client_id: process.env.TODO_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.TODO_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.TODO_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.TODO_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    },
    mongo_url: 'mongodb+srv://kanishy:kans@cluster0.h1fuw4l.mongodb.net/tasks_db?retryWrites=true&w=majority&appName=Cluster0'

}

module.exports = eval(process.env.TODO_ENVIRONMENT) == undefined ? development : eval(process.env.TODO_ENVIRONMENT);

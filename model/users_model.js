const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');


const user_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png'
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
    taskCompleted: {
        type: Number,
        default: 0
    },
    taskCreated: {
        type: Number,
        default: 0
    },
    taskDeleted: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", AVATAR_PATH))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

user_schema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');  //as our form has
user_schema.statics.avatarPath = AVATAR_PATH;

const UserModel = mongoose.model('User', user_schema);
module.exports = UserModel;
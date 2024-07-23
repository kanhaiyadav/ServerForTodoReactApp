const mongoose = require('mongoose');

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

const UserModel = mongoose.model('User', user_schema);
module.exports = UserModel;
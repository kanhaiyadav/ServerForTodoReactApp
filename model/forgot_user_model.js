const mongoose = require('mongoose');

const forgot_user_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    valid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


const ForgotUser = mongoose.model('ForgotUser', forgot_user_schema);

module.exports = ForgotUser;
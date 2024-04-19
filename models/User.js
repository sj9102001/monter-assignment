const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    location: {
        type: String
    },
    age: {
        type: Number
    },
    work_details: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);

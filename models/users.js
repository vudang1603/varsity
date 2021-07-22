const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: Number,
        default: 0
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;
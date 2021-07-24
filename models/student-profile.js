const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/users')


const studentSchema = new mongoose.Schema({
    _id: {
        type: Object,
        default: ''
    },
    name: {
        type: String,
        require: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    email: {
        type: String,
        default: ''
    },
    fb: {
        type: String,
        default: ""
    }

})

    


const Student = mongoose.model('Student', studentSchema)
module.exports = Student;
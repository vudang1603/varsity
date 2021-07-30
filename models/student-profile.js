const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/users')
const Course = require('../models/courses')
const Schema = mongoose.Schema;


const studentSchema = Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    name: {
        type: String,
        default: ''
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
    },
    registeredCourse: [{
        type: Schema.Types.ObjectId,
        ref: Course
    }]

})

    


const Student = mongoose.model('Student', studentSchema)
module.exports = Student;
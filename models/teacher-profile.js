const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/users')


const teacherSchema = new mongoose.Schema({
    _id: {
        type: Object,
        default: ''
    },
    image: {
        data: Buffer,
        contentType: String,
        default: ''
    },
    name: {
        type: String,
        require: true
    },
    degree: {
        type: String,
        require: true
    },
    workplace: {
        type: String,
        require: true
    },
    introduce: {
        type: String,
        default: ""
    },
    achievement: {
        type: String,
        default: ""
    },
    tcmethod: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ''
    },
    fb: {
        type: String,
        default: ""
    },
    tw: {
        type: String,
        default: ""
    },
    lnk: {
        type: String,
        default: ""
    },
    idstreamroom: {
        type: String,
        default: ""
    }

})

    


const Teacher = mongoose.model('Teacher', teacherSchema)
module.exports = Teacher;
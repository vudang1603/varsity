const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../config/auth');
const User = require('./users')


const classRoom = new mongoose.Schema({
    _id: {
        type: Object,
        default: ''
    },
    classname: {
        type: String,
        default: ''
    },
    image: {
        data: Buffer,
        contentType: String
    },
    author: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ""
    },
    tittle: {
        type: String,
        default: ""
    },
    conntain: {
        type: String,
        default: ""
    },
    homework: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
})

    


const ClassRoom = mongoose.model('ClassRoom', classRoom)
module.exports = ClassRoom;
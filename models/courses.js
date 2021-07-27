const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../config/auth');

const course = new mongoose.Schema({
    author:{
        type: String
    },
    title: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        default: ""
    },
    image:{
        data: Buffer,
        contentType: String
    },
    description:{
        type: String,
        default: ""
    },
    lessons:[{
        title: {
            type: String,
            default: ""
        },
        link: {
            type: String,
            default: ""
        }
    }],
    date: {
        type: Date,
        default: Date.now()
    }
})

const Course = mongoose.model('Course', course)
module.exports = Course;
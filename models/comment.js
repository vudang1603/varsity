const mongoose = require('mongoose')
const Student = require('../models/student-profile')
const Schema = mongoose.Schema;

const comment = Schema({
    forumId: {
        type: String,
        default: ""
    },
    poster: {
        name: {
            type: String,
            default: ""
        },
        image: {
            data: Buffer,
            contentType: String
        }
    },
    content:{
        type: String,
        default: ""
    }
})

const Comment = mongoose.model('Comment', comment)
module.exports = Comment
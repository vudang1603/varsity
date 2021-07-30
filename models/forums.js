const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Student = require('../models/student-profile')
const Comment = require('../models/comment')

const forum = Schema({
    poster: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    title:{
        type: String,
        default: ""
    },
    content:{
        type: String,
        default: ""
    },
    comment:[{
        type: Schema.Types.ObjectId,
        ref: Comment
    }],
    date: {
        type: Date,
        default: Date.now()
    }


})
const Forums = mongoose.model('Forums', forum)
module.exports = Forums
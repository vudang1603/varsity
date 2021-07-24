var express = require('express')
const { fstat } = require('fs')
var router = express.Router()
var multer = require('multer')
var path = require('path')
var fs = require('fs')
const {ensureAuthenticated} = require('../config/auth');
const Student = require('../models/student-profile')
 

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/assets/img/student')
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({ storage: storage })
const handleError =(err, res)=>{
    res
    .status(500)
    .contentType("text/plain")
    .end("Something went wrong!")
}
router.post('/', upload.single('file'), function(req, res, next){
    var img = fs.readFileSync(req.file.path)
    const name = req.body.fullname
    const emailin = req.body.email
    const facebook = req.body.facebook
    var encode_image = img.toString('base64')
    var final_image = {
        contentType: req.file.mimetype,
        image: new Buffer.from(encode_image, 'base64')
    };
    const id = req.user.id;
    Student.findOne({_id: id}).exec((err, student)=>{
        if(student){
            Student.findByIdAndUpdate(id, {$set:{
                name: name,
                email: emailin,
                image: final_image,
                fb: facebook
            }}, {new: true}, (err, doc)=>{
                if(err){
                    console.log("Something wrong when updating data!");
                }
                console.log(doc)
            })
            res.redirect(req.get('referer'));
        } else {
            const newStudent = new Student({
                _id: id, 
                name: name,
                email: emailin,
                image: final_image,
                fb: facebook
            })
            newStudent.save().then((value)=>{
                console.log(value);
                res.redirect(req.get('referer'));
            }).catch(value=> console.log(value));
        }
    })

});
module.exports = router;

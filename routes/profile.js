var express = require('express')
const { fstat } = require('fs')
var router = express.Router()
var multer = require('multer')
var path = require('path')
var fs = require('fs')
const {ensureAuthenticated} = require('../config/auth');
const Student = require('../models/student-profile')
const Teacher = require('../models/teacher-profile')
//console.log(path);
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  };

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'public/assets/img/student')
    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({ storage: storage, fileFilter: multerFilter})
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
        data: img,
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
router.get('/registered-course', function(req, res, next){
    if(req.isAuthenticated()){
        const id = req.user.id;
        Student.findOne({_id: id}).exec((err, student)=>{
            const image = student.image
            res.render('student-course',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "0", image: image, student: student});
        }) 
    }
    
    
})
router.get('/course-management', function(req, res, next){
    if(req.isAuthenticated()){
        const id = req.user.id;
        Teacher.findOne({_id: id}).exec((err, teacher)=>{
            const image = teacher.image
            res.render('teacher-course',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "1", image: image, teacher: teacher});
        }) 
    }
    
    
})

router.post('/addprofile', upload.single('file'), function(req, res, next){
    var img = fs.readFileSync(req.file.path)
    const fullname = req.body.fullname
    const deegree = req.body.deegree
    const workplace = req.body.workplace
    const introduce = req.body.introduce
    const achievement = req.body.achievement
    const tcmethod = req.body.tcmethod
    const email = req.body.email
    const fb = req.body.fb
    const tw = req.body.tw
    const lnk = req.body.lnk
    var encode_image = img.toString('base64')
    var final_image = {
        data: img,
        contentType: req.file.mimetype,
        image: new Buffer.from(encode_image, 'base64')
    };
    const id = req.user.id;
    
    Teacher.findOne({_id: id}).exec((err, teacher)=>{
        if(teacher){
            Teacher.findByIdAndUpdate(id, {$set:{
                
                image: final_image,
                name: fullname,
                degree:deegree,
                workplace:workplace,
                introduce:introduce,
                achievement:achievement,
                tcmethod:tcmethod,
                email:email,
                fb: fb,
                tw: tw,
                lnk: lnk
            }}, {new: true}, (err, doc)=>{
                if(err){
                    console.log("Something wrong when updating data!");
                }
                console.log(doc)
            })
            res.redirect(req.get('referer'));
        } else {
            const newTeacher = new Teacher({
                _id: id, 
                image: final_image,
                name: fullname,
                degree:deegree,
                workplace:workplace,
                introduce:introduce,
                achievement:achievement,
                tcmethod:tcmethod,
                email:email,
                fb: fb,
                tw: tw,
                lnk: lnk
            })
            newTeacher.save().then((value)=>{
                console.log(value);
                res.redirect(req.get('referer'));
            }).catch(value=> console.log(value));
        }
    })
});

module.exports = router;

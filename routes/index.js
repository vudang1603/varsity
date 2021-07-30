var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Student = require('../models/student-profile')
const Teacher = require('../models/teacher-profile');
const User = require('../models/users');
const Course = require('../models/courses');
var fs = require('fs');
const ClassRoom = require('../models/class-room');
const Forums = require('../models/forums')
/* GET home page. */

router.get('/', function(req, res, next) {
  var tcFind = Teacher.find({}).limit(8)
  var coFind = Course.find({}).limit(10)
  var clFind = ClassRoom.find({}).limit(3)
  if(req.isAuthenticated()){
    const email = req.user.email;
    clFind.exec((err, classroom) =>{
      tcFind.exec((err, teacher)=>{
        coFind.exec((err, course)=>{
          User.findOne({email: email}).exec((err, user)=> {
            if(user.role==0){
              res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "0", teachers: teacher, course: course, classroom: classroom});
            } else {
              res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "1", teachers: teacher, course: course,classroom: classroom});
            }
          })
        })
      })
    })
  } else {
    clFind.exec((err, classroom) =>{
    tcFind.exec((err, teacher)=>{
      coFind.exec((err, course)=>{
        res.render('index',{tab: 1, title: "Trang Chủ", login: "false", teachers: teacher, course: course, classroom: classroom});
      })
    })
  })
  }
});
router.get('/index', function(req, res, next) {
  res.redirect('/')
});
router.get('/course-list', function(req, res, next) {
  var coFind = Course.find({}).limit(3)
  let teacher = [];
  Course.find({}).then(function(course){
    coFind.exec((err, newCourse)=>{
      let teacher1 = []
    course.forEach(function(i){
      teacher.push(i.author)            
    })
    teacher.forEach(function(u){
      Teacher.findOne({_id: u}).exec((err, doc)=>{
        teacher1.push(doc.name)
      })
    })
    console.log(teacher1)
    res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học", login: "false", course: course, teacher: teacher, newCourse: newCourse});
    })
  })
  
  
});
router.get('/course-list/:cate', function(req, res, next) {
  var cate = req.params.cate
  var coFind = Course.find({}).limit(3)
  Course.find({category: cate}).then(function(course){
    coFind.exec((err, newCourse)=>{
    res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học", login: "false", course: course, newCourse: newCourse});
    })
  })
  
  
});
router.get('/course-detail/:id', function(req, res, next) {
  const courseId = req.params.id;
  Course.findOne({_id: courseId}).exec((err, course)=>{
    var video_id = course.lessons[0].link.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
       video_id = video_id.substring(0, ampersandPosition); 
    }
    var date = new Date(course.date)
    var d = date.getDate()
    var m = date.getMonth()+1
    var y = date.getFullYear()
    var final_date = d+'/'+m+'/'+y
    Course.find({category: course.category}).exec((err, doc)=>{
      res.render('course-detail',{tab: 3, title: "Chi Tiết Khoá Học", login: "false", course: course, recourse: doc, firstId: video_id, date: final_date});
    })
  })
  
});
router.get('/class-list', function(req, res, next) {
  res.render('class-list',{tab: 4, title: "Danh Sách Lớp Học", login: "false"});
});
router.get('/class-detail', function(req, res, next) {
  res.render('class-detail',{tab: 4, title: "Chi Tiết Lớp Học", login: "false"});
});
router.get('/support', function(req, res, next) {
  res.render('support',{tab: 6, title: "Hỗ Trợ", login: "false"});
});
router.get('/teachers', function(req, res, next) {
  Teacher.find({}).exec((err, teacher)=>{
    res.render('teachers',{tab: 2, title: "Danh Sách Gia Sư", login: "false", teachers: teacher});
  })
});
router.get('/teacher-detail/:id', function(req, res, next) {
  const tcId = req.params.id
  var coFind = Course.find({author: tcId}).limit(3)
  var clFind = ClassRoom.find({_id: tcId}).limit(3)
  coFind.exec((err, course)=>{
    clFind.exec((err, classroom) =>{
      Teacher.findOne({_id: tcId}).exec((err, teacher)=>{
        res.render('teacher-detail',{tab: 2, title: "Thông Tin Gia Sư", login: "false", teacher: teacher, classroom: classroom, course: course});
      })
    })
  })
});
router.get('/forums', function(req, res, next) {
  Forums.find({}).populate('poster').exec((err, doc)=>{
    if(err) {
      console.log(err)
    }
    console.log(doc)
  })
  Forums.find({}).populate('poster').exec((err, forums)=>{
    var final_date = []
    forums.forEach(function(f){
      var date = new Date(f.date)
      var d = date.getDate()
      var m = date.getMonth()+1
      var y = date.getFullYear()
      var h = date.getHours()
      var mi = date.getMinutes()
      final_date.push(h+':'+mi+' '+d+'/'+m+'/'+y)
    })
    res.render('forums',{tab: 5, title: "Diễn Đàn", login: "false", forums: forums, final_date: final_date});
  })
});
router.post('/forums/add-question',ensureAuthenticated , function(req, res, next) {
  const id = req.user.id
  const title = req.body.title
  const content = req.body.content
  Student.findOne({_id: id}).exec((err, student)=>{
    const forum = new Forums({
      poster: id,
      title: title,
      content: content
    })
    forum.save().then((value)=>{
      console.log(value);
      res.redirect(req.get('referer'));
    }).catch(value=> console.log(value));
  })
});


router.post('/forums/:id/add-comment',ensureAuthenticated , function(req, res, next) {
  const id = req.user.id
  const foId = req.params.id
  const content = req.body.comment
  
  
});


router.get('/profile', ensureAuthenticated, (req, res, next) => {
  const email = req.user.email;
  const user_id = req.user.id;
    User.findOne({_id: user_id}).exec((err, user)=> {
      if(user.role==0){
        Student.findOne({_id: user_id}).exec((err, student)=> {
          if(student){
            const image = student.image
            res.render('student-profile',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "0", image: image, student: student});
          } 
        })
      } else {   
        Teacher.findOne({_id: user_id}).exec((err, teacher)=> {
          const image = teacher.image
            res.render('teacher-profile',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "1", image: image, teacher: teacher});
        })        
      }  
    })
})



module.exports = router;

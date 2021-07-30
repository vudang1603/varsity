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
const Comment = require('../models/comment')
/* GET home page. */

// gửi mail
var nodemailer = require('nodemailer');


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
  Course.find({}).then(function(course){
    coFind.exec((err, newCourse)=>{
      if(req.isAuthenticated()){
        res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học", login: "true", course: course, newCourse: newCourse});
      } else {
        res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học", login: "false", course: course, newCourse: newCourse});
      }
    })
  })
  
  
});
router.get('/course-list/:cate', function(req, res, next) {
  var cate = req.params.cate
  var coFind = Course.find({}).limit(3)
  Course.find({category: cate}).then(function(course){
    coFind.exec((err, newCourse)=>{
      if(req.isAuthenticated()){
        res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học", login: "true", course: course, newCourse: newCourse});
      } else {
        res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học", login: "false", course: course, newCourse: newCourse});
      }
    
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
      if(req.isAuthenticated()){
        const id = req.user.id
        Student.findOne({registeredCourse: courseId}).exec((err, student)=>{
          res.render('course-detail',{tab: 3, title: "Chi Tiết Khoá Học", login: "true", course: course, recourse: doc, firstId: video_id, date: final_date, student: student});
        })
        
      } else {
        res.render('course-detail',{tab: 3, title: "Chi Tiết Khoá Học", login: "false", course: course, recourse: doc, firstId: video_id, date: final_date, student: ""});
      }
      
    })
  })
  
});
router.get('/course-detail/:id/register', ensureAuthenticated, function(req, res, next) {
  const courseId = req.params.id;
  const id = req.user.id;
  User.findOne({_id: id}).exec((err, user)=>{
    if(user.role==0){
     Student.findByIdAndUpdate(id, {$set:{
      registeredCourse: courseId
     }}, {new: true}, (err, doc)=>{
       if(err){
         console.log(err)
       }
       console.log(doc)
     })
    }
  })
  res.redirect(req.get('referer'));
});

router.get('/register-class/:id', ensureAuthenticated, function(req, res, next){
  const id = req.params.id;
  ClassRoom.findOne({_id: id}).exec((err, classr) =>{
    const idclass = classr._id
    const password = classr.password
    res.render('register-class',{tab:9 , title: "Xác Nhận Đăng Ký", login: "true", password:password, idclass: idclass})
  })
})


router.get('/checkloginclass/:id', ensureAuthenticated, function(req, res, next){
  const id = req.params.id;
  res.render('checkloginclass',{tab:12, title: "Tham Gia Lớp Học", login: "true", idclass: id})
})

router.post('/checklogin/', ensureAuthenticated, function(req, res, next){
  const password = req.body.password
  const idclass = req.body.idclass
  
  if(req.isAuthenticated()){
    const iduser = req.user.id
    ClassRoom.findOne({_id: idclass, password:password, student:iduser}).exec((err, login)=>{
      if(login){
        ClassRoom.findOne({_id: idclass}).exec((err, classroom)=>{
          User.findOne({_id: iduser}).exec((err,user)=>{
            const role = user.role
            res.render('classroom', {tab: 11, title: "Lớp Học", login: "true",role: role, classroom: classroom, user:user})
          })
        })
      }else{
        res.redirect(req.get('referer'));
      }
    })
  }
  
})



router.post('/register-class/:id', function(req, res, next){
  
  const email = req.body.useremail;
  const password = req.body.password;
  const idclass = req.body.idclass;
  console.log(email)
  console.log(password)
  User.findOne({email: email}).exec((err,user)=>{
      if(user){
        if(user.role == 1){
          res.render('register-successful', {tab:10 ,title: "Đăng Ký Không Thành Công", login: "true", password: password, user: user })
        }else{
          const iduser = user._id;
          ClassRoom.findByIdAndUpdate(idclass, {$set:{
            student:iduser
          }}, {new: true}, (err, doc)=>{
            if(err){
                console.log("Something wrong when updating data!");
            }
            console.log(doc)
          })
          res.render('register-successful', {tab:10 ,title: "Đăng Ký Thành Công", login: "true", password: password, user: user })
        }
      }else{
        
        res.render('register-class',{tab:9 , title: "Xác Nhận Đăng Ký", login: "true", password:password})
      }
  })
  
})



router.get('/classroom/:idclass',ensureAuthenticated, function(req,res, next){
  const idclass = req.params.idclass;
  if(req.isAuthenticated()){
    const userid = req.user.id;
    ClassRoom.findOne({_id: idclass}).exec((err, classroom)=>{
      User.findOne({_id: userid}).exec((err,user)=>{
        const role = user.role
        res.render('classroom', {tab: 11, title: "Lớp Học", login: "true",role: role, classroom: classroom, user:user})
      })
    })
  }
})


router.post('/classroom/', function(req, res, next){
  if(req.isAuthenticated()){
    const tittle = req.body.tittlelesson
    const contain = req.body.contaillesson
    const video = req.body.idvideo
    const homework = req.body.homework
    const idclass = req.body.idclass
    console.log(tittle)
    console.log(contain)
    console.log(video)
    console.log(homework)
    console.log(idclass)
    ClassRoom.findByIdAndUpdate(idclass, {$set:{

      tittle: tittle,
      conntain: contain,
      videoid: video,
      homework:homework,
    }}, {new: true}, (err, doc)=>{
      if(err){
          console.log("Something wrong when updating data!");
      }
      console.log(doc)
    })
  res.redirect(req.get('referer'));
  }
})

router.get('/class-list', function(req, res, next) {
  var clFind = ClassRoom.find({}).limit(10)
  if(req.isAuthenticated()){
    clFind.exec((err, classroom) =>{
      res.render('class-list',{tab: 4, title: "Danh Sách Lớp Học", login: "true", classroom: classroom});  
    })
  } else {
    clFind.exec((err, classroom) =>{
      res.render('class-list',{tab: 4, title: "Danh Sách Lớp Học", login: "true",classroom: classroom});  
    })
  }
})
  
router.get('/class-detail/:id', function(req, res, next) {
  const classId = req.params.id;
  var coFind = Course.find({}).limit(3)
  var clFind = ClassRoom.find({}).limit(5)
  coFind.exec((err, course) =>{
    clFind.exec((err, classroom) =>{
      ClassRoom.findOne({_id: classId}).exec((err, classone)=>{
        const image = classone.image
        res.render('class-detail',{tab: 4, title: "Chi Tiết Lớp Học", login: "true",image:image ,classone: classone, classroom: classroom, course: course });
      })
    })
  })
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
  Forums.find({}).populate('poster comment').exec((err, forums)=>{
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
  
  Student.findOne({_id: id}).exec((err, student)=>{
    const comment = new Comment({
      forumId: foId,
      poster: {
        name: student.name,
        image: student.image
      },
      content: content
    })
    Forums.findByIdAndUpdate({_id: foId}, {$push:{
      comment: comment._id
    }}, {new: true}, (err, doc)=>{
      if(err){
        console.log(err)
      }
    })
    comment.save().then((value)=>{
      console.log(value);
      res.redirect(req.get('referer'));
    }).catch(value=> console.log(value));
  })
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

router.get('/search', (req, res, next)=>{
  let txt = req.query.search
  txt = txt.toLowerCase()
  
  Course.find({ 'title' : new RegExp("^"+txt+"$",'i')}).exec((err, course)=>{
    console.log(course)
  })
})


router.post('/sendmail', (req, res, next)=>{
  const fullname = req.body.author
  const email =req.body.email
  const subject = req.body.subject
  const comment = req.body.comment

  var nodemailer = require('nodemailer');

  const option = {
    service: 'gmail',
    auth: {
        user: 'ngoctrungdev20@gmail.com', // email hoặc username
        pass: '1982140Aa!' // password
    }
  };
  var transporter = nodemailer.createTransport(option);

  transporter.verify(function(error, success) {
    // Nếu có lỗi.
    if (error) {
        console.log(error);
    } else { //Nếu thành công.
        console.log('Kết nối thành công!');
        var mail = {
            from: 'ngoctrungdev20@gmail.com', // Địa chỉ email của người gửi
            to: email, // Địa chỉ email của người nhận
            subject: subject, // Tiêu đề mail
            text: 'Hello:  '+fullname+"   Your problem:"+comment, // Nội dung mail dạng text
        };
        //Tiến hành gửi email
        transporter.sendMail(mail, function(error, info) {
            if (error) { // nếu có lỗi
                console.log(error);
            } else { //nếu thành công
                console.log('Email sent: ' + info.response);
            }
        });
    }
});

  res.render('thankyou', {tab: 13, title: "Thank You", login: "true"})
})





module.exports = router;

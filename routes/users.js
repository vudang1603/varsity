var express = require('express');
var router = express.Router();
const User = require('../models/users');
var bcrypt = require('bcrypt');
var passport = require('passport');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: true})
const Student = require('../models/student-profile')
const Teacher = require('../models/teacher-profile')
var fs = require('fs')
/* GET users listing. */

//register
router.get('/register', function(req, res) {
  res.render('user-register',{title: "Đăng Ký"});
});
router.get('/teacher-register', function(req, res) {
  res.render('teacher-register',{title: "Đăng Ký Gia Sư"});
});
//login
router.get('/login', function(req, res) {
  res.render('user-login',{title: "Đăng Nhập"});
});
router.post('/login', (req, res, next)=>{
  passport.authenticate('local',{
    successRedirect : '../',
    failureRedirect : './login',
    failureFlash : true,
  }) (req, res, next);
})

//register
router.get('/register', function(req, res) {
  res.render('user-register',{title: "Đăng Ký"});
});
router.post('/register', urlencodedParser, (req, res)=>{
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  let errors=[];
  console.log('Email '+ email + ' pass '+ password);
  if(!email || !password || !password2){
    errors.push({msg: 'Vui lòng nhập đầy đủ thông tin!!'})
  }

  if(password != password2){
    errors.push({msg: 'Mật khẩu không khớp!!'})
  }

  if(password.length < 6){
    errors.push({msg: 'Mật khẩu phải hơn 6 ký tự!!'})
  }

  if(errors.length > 0){
    res.render('user-register',{
      title: "Đăng Ký",
      errors: errors,
      email: email,
      password: password,
      password2: password2
    })
  } else {
    User.findOne({email : email}).exec((err,user)=>{
      console.log(user);
      if(user){
        errors.push({msg: 'Email đã tồn tại!!'});
        res.render('user-register',{title: "Đăng Ký",errors,email,password,password2})
      } else {
        const newUser = new User({
          email : email,
          password : password,
          role: 0
        });
        bcrypt.genSalt(10,(err, salt)=>
        bcrypt.hash(newUser.password,salt,
          (err,hash)=>{
            if(err) throw err;
            newUser.password = hash;
          newUser.save()
            .then((value)=>{
              console.log(value);
              req.flash('success_msg','Đăng ký thành công!');
              res.redirect('./login');
            })
            .catch(value=> console.log(value));
          }))
          var imageAsBase64 = fs.readFileSync('public/assets/img/student/no-avatar.png');
          const newStudent = new Student({
            _id: newUser.id,
            image: {
              data: imageAsBase64,
              contentType: 'image/png',
              image: new Buffer.from(imageAsBase64, 'base64')
            }
        })
        newStudent.save().then((value)=>{
            console.log(value);
        }).catch(value=> console.log(value));
      }
    })
  }
})

router.post('/teacher-register', urlencodedParser, (req, res)=>{
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  let errors=[];
  console.log('Email '+ email + ' pass '+ password);
  if(!email || !password || !password2){
    errors.push({msg: 'Vui lòng nhập đầy đủ thông tin!!'})
  }

  if(password != password2){
    errors.push({msg: 'Mật khẩu không khớp!!'})
  }

  if(password.length < 6){
    errors.push({msg: 'Mật khẩu phải hơn 6 ký tự!!'})
  }

  if(errors.length > 0){
    res.render('teacher-register',{
      title: "Đăng Ký",
      errors: errors,
      email: email,
      password: password,
      password2: password2
    })
  } else {
    User.findOne({email : email}).exec((err,user)=>{
      console.log(user);
      if(user){
        errors.push({msg: 'Email đã tồn tại!!'});
        res.render('teacher-register',{title: "Đăng Ký",errors,email,password,password2})
      } else {
        const newUser = new User({
          email : email,
          password : password,
          role: 1
        });
        bcrypt.genSalt(10,(err, salt)=>
        bcrypt.hash(newUser.password,salt,
          (err,hash)=>{
            if(err) throw err;
            newUser.password = hash;
          newUser.save()
            .then((value)=>{
              console.log(value);
              req.flash('success_msg','Đăng ký thành công!');
              res.redirect('./login');
            })
            .catch(value=> console.log(value));
          }))

          var imageAsBase64 = fs.readFileSync('public/assets/img/teachers/no-avatar.png');
          const newTeacher = new Teacher({
            _id: newUser.id,
            image: {
              data: imageAsBase64,
              contentType: 'image/png',
              image: new Buffer.from(imageAsBase64, 'base64')
            }
        })
        newTeacher.save().then((value)=>{
            console.log(value);
        }).catch(value=> console.log(value));
      }
    })
  }
})

//logout
router.get('/logout',(req, res)=>{
  req.logout();
  req.flash('success_msg','Đăng xuất thành công!!');
  res.redirect('./login');
})

module.exports = router;

var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Student = require('../models/student-profile')
const Teacher = require('../models/teacher-profile');
const User = require('../models/users');
var fs = require('fs');
const { route } = require('./users');


const server = require('http').Server(router)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');
const { isObject } = require('util');


/* GET home page. */
router.get('/', function(req, res, next) {
  
  if(req.isAuthenticated()){
    const email = req.user.email;
      Teacher.find({}).exec((err, teacher)=>{
        User.findOne({email: email}).exec((err, user)=> {
          if(user.role==0){
            res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "0", teachers: teacher});
          } else {
            res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "1", teachers: teacher});
          }
        })
      })
  } else {
    Teacher.find({}, (err, teachers)=>{
      res.render('index',{tab: 1, title: "Trang Chủ", login: "false", teachers: teachers});
    })
  }
});
router.get('/index', function(req, res, next) {
  if(req.isAuthenticated()){
    const email = req.user.email;
      Teacher.find({}).exec((err, teacher)=>{
        User.findOne({email: email}).exec((err, user)=> {
          if(user.role==0){
            res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "0", teachers: teacher});
          } else {
            res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "1", teachers: teacher});
          }
        })
      })
  } else {
    Teacher.find({}, (err, teachers)=>{
      res.render('index',{tab: 1, title: "Trang Chủ", login: "false", teachers: teachers});
    })
  }
});
router.get('/course-list', function(req, res, next) {
  res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học", login: "false"});
});
router.get('/course-detail', function(req, res, next) {
  res.render('course-detail',{tab: 3, title: "Chi Tiết Khoá Học", login: "false"});
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
  res.render('teachers',{tab: 2, title: "Danh Sách Gia Sư", login: "false"});
});
router.get('/teacher-detail', function(req, res, next) {
  res.render('teacher-detail',{tab: 1, title: "Thông Tin Gia Sư", login: "false"});
});
router.get('/forums', function(req, res, next) {
  res.render('forums',{tab: 5, title: "Diễn Đàn", login: "false"});
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

router.get('/streamroom',(req, res) => {
  res.redirect(`/${uuidV4()}`);
})

router.get('/:streamroom', function(req, res, next) {
  res.render('streamroom',{tab: 8, title: "Steam Romm", login: "true", roomId: req.params.streamroom});
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId,userId)
  })
})

module.exports = router;

var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/users');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    const email = req.user.email;
    User.findOne({email: email}).exec((err, user)=> {
      if(user.role==0){
        res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "0"});
      } else {
        res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "1"});
      }
    })
  } else {
    res.render('index',{tab: 1, title: "Trang Chủ", login: "false"});
  }
  
});
router.get('/index', function(req, res, next) {
  if(req.isAuthenticated()){
    const email = req.user.email;
    User.findOne({email: email}).exec((err, user)=> {
      if(user.role==0){
        res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "0"});
      } else {
        res.render('index',{tab: 1, title: "Trang Chủ", login: "true", role: "1"});
      }
    })
  } else {
    res.render('index',{tab: 1, title: "Trang Chủ", login: "false"});
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
    User.findOne({email: email}).exec((err, user)=> {
      if(user.role==0){
        res.render('student-profile',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "0"});
      } else {
        res.render('teacher-profile',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "1"});
      }
    })
})
router.get('/teacher-profile',ensureAuthenticated, function(req, res, next) {
  res.render('teacher-profile',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "1"});
});
router.get('/student-profile',ensureAuthenticated, function(req, res, next) {
  res.render('student-profile',{tab: 7, title: "Trang Cá Nhân", login: "true", role: "0"});
});



module.exports = router;

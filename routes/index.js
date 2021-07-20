var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{tab: 1, title: "Trang Chủ"});
});
router.get('/index', function(req, res, next) {
  res.render('index',{tab: 1, title: "Trang Chủ"});
});
router.get('/course-list', function(req, res, next) {
  res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học"});
});
router.get('/course-detail', function(req, res, next) {
  res.render('course-detail',{title: "Chi Tiết Khoá Học"});
});
router.get('/class-list', function(req, res, next) {
  res.render('class-list',{tab: 4, title: "Danh Sách Lớp Học"});
});
router.get('/class-detail', function(req, res, next) {
  res.render('class-detail',{title: "Chi Tiết Lớp Học"});
});
router.get('/support', function(req, res, next) {
  res.render('support',{tab: 6, title: "Hỗ Trợ"});
});
router.get('/teachers', function(req, res, next) {
  res.render('teachers',{tab: 2, title: "Danh Sách Gia Sư"});
});
router.get('/teacher-detail', function(req, res, next) {
  res.render('teacher-detail',{title: "Thông Tin Gia Sư"});
});
router.get('/forums', function(req, res, next) {
  res.render('forums',{tab: 5, title: "Diễn Đàn"});
});
router.get('/teacher-profile', function(req, res, next) {
  res.render('teacher-profile',{title: "Trang Cá Nhân"});
});
router.get('/student-profile', function(req, res, next) {
  res.render('student-profile',{title: "Trang Cá Nhân"});
});
//login
router.get('/login', function(req, res) {
  res.render('user-login',{title: "Đăng Nhập"});
});

//register
router.get('/register', function(req, res) {
  res.render('user-register',{title: "Đăng Ký"});
});
router.get('/teacher-register', function(req, res) {
  res.render('teacher-register',{title: "Đăng Ký Gia Sư"});
});


//dashboard
router.get('/dashboard',ensureAuthenticated ,function(req, res) {
  res.render('dashboard',{
    user: req.user
  });
});
module.exports = router;

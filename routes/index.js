var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('index',{tab: 1, title: "Trang Chủ", login: "true"});
  } else {
    res.render('index',{tab: 1, title: "Trang Chủ", login: "false"});
  }
  
});
router.get('/index', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('index',{tab: 1, title: "Trang Chủ", login: "true"});
  } else {
    res.render('index',{tab: 1, title: "Trang Chủ", login: "false"});
  }
});
router.get('/course-list', function(req, res, next) {
  res.render('course-list',{tab: 3, title: "Danh Sách Khoá Học"});
});
router.get('/course-detail', function(req, res, next) {
  res.render('course-detail',{tab: 3, title: "Chi Tiết Khoá Học"});
});
router.get('/class-list', function(req, res, next) {
  res.render('class-list',{tab: 4, title: "Danh Sách Lớp Học"});
});
router.get('/class-detail', function(req, res, next) {
  res.render('class-detail',{tab: 4, title: "Chi Tiết Lớp Học"});
});
router.get('/support', function(req, res, next) {
  res.render('support',{tab: 6, title: "Hỗ Trợ"});
});
router.get('/teachers', function(req, res, next) {
  res.render('teachers',{tab: 2, title: "Danh Sách Gia Sư"});
});
router.get('/teacher-detail', function(req, res, next) {
  res.render('teacher-detail',{tab: 1, title: "Thông Tin Gia Sư"});
});
router.get('/forums', function(req, res, next) {
  res.render('forums',{tab: 5, title: "Diễn Đàn"});
});
router.get('/teacher-profile',ensureAuthenticated, function(req, res, next) {
  res.render('teacher-profile',{tab: 7, title: "Trang Cá Nhân"});
});
router.get('/student-profile',ensureAuthenticated, function(req, res, next) {
  res.render('student-profile',{tab: 7, title: "Trang Cá Nhân"});
});



//dashboard
router.get('/dashboard',ensureAuthenticated ,function(req, res) {
  res.render('dashboard',{
    user: req.user
  });
});
module.exports = router;

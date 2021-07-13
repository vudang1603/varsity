var express = require('express');
var router = express.Router();
const User = require('../models/users');
var bcrypt = require('bcrypt');
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//login
router.get('/login', function(req, res) {
  res.render('user-login');
});
router.post('/login', (req, res, next)=>{
  passport.authenticate('local',{
    successRedirect : '../dashboard',
    failureRedirect : './login',
    failureFlash : true,
  }) (req, res, next);
})

//register
router.get('/register', function(req, res) {
  res.render('user-register');
});
router.post('/register', (req, res)=>{
  const {email, password, password2} = req.body;
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
        res.render('user-register',{errors,email,password,password2})
      } else {
        const newUser = new User({
          email : email,
          password : password
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

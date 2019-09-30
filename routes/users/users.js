
    const express = require('express');
    const router = express.Router();
    const authorsApi = require('../../models/authors');
    const { check, validationResult } = require('express-validator');
    const md5=require('md5');
    const passport = require('passport');
    //如果访问`/blog`，重定向到`/blog/articles`
    router.get('/',function(req,res,next){
        res.redirect('/users/login')
    })
    router.get('/login',function(req,res,next){
        res.render('users/login')
    })
    // router.post('/login',[
    //   check('email').isEmail().withMessage('请输入正确的邮箱'),
    //   check('password').isLength({ min: 6,max:15 }).withMessage('密码必须是六至十五位数字或字母')
    // ],function(req,res,next){
    //   const errors = validationResult(req);
    //   if(!errors.isEmpty()){
    //     res.render('users/login',{errors:errors.errors})
    //   }else{
    //     passport.authenticate('local', { failureRedirect: '/admin/users/login' });
    //     res.redirect('/blog/articles')
    //   }
    // })

    router.post('/login',
      passport.authenticate('local', { failureRedirect: '/users/login' }),
      function(req,res,next){
        res.redirect('/blog/articles')           
    })


    router.get('/register',function(req,res,next){
        res.render('users/register')
    })
    router.post('/register',[
      check('email').isEmail().withMessage('请输入正确的邮箱'),
      check('password').isLength({ min: 6,max:15 }).withMessage('密码必须是六至十五位数字或字母')
    ], function(req,res,next){
      const errors = validationResult(req);
      if(req.body.confirmPassword!==req.body.password){
        errors.errors.push({msg:'两次密码输入不一致'})
      }

      if(!errors.isEmpty()){
        res.render('users/register',{errors:errors.errors})
      }else{
        let author={};
        if(req.body.username){
          author.name=req.body.username;
        }
        author.email=req.body.email;
        author.password=req.body.password;
        author.created = new Date();
        let result=authorsApi.getAuthors({$or:[{email:author.email},{name:author.name}]})
        result.then(auths=>{
            if(auths.length!=0){
              req.flash('faild','该用户已经注册！');
              res.render('users/register')
            }else{
              authorsApi.addAuthor(author).then(isSaved=>{
                if(isSaved.ok=1){
                  req.flash('success','注册成功，请登录!');
                  res.redirect('/users/login')
                }else{
                  req.flash('faild','用户添加失败！');
                  res.render('users/register')
                }
              })
            }
        })
      }
    })
    router.get('/logout',function(req,res,next){
        res.redirect('/blog/articles');
    })

    module.exports = router;
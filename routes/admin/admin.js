
    const express = require('express');
    const router = express.Router();
    const articlesRouter = require('./articles');
    const categoriesRouter = require('./categories');
    const authorsRouter = require('./authors');

    const adminsApi = require('../../models/administrators');
    const { check, validationResult } = require('express-validator');
    const md5=require('md5');
    const passport = require('passport');

    //如果访问`/admin`，重定向到`/admin/articles`
    router.get('/',function(req,res,next){
        res.redirect('/admin/login')
    })

    //`/admin`下中间件，添加该路由下全局变量menu,用于侧边栏活动显示
    router.use('/:menu',function(req,res,next){ //用于文章管理侧边栏活动显示
      res.locals.menu=req.params.menu;
      next();
    })

    router.use('/articles',articlesRouter)
    router.use('/categories',categoriesRouter)
    router.use('/authors',authorsRouter) 

    router.get('/login',function(req,res,next){
        res.render('admin/login')
    })

    router.post('/login',
      passport.authenticate('local', { failureRedirect: '/admin/login' }),
      function(req,res,next){
        res.redirect('/admin/articles')           
    })


    router.get('/register',function(req,res,next){
        res.render('admin/register')
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
        let admin={};
        if(req.body.username){
          admin.name=req.body.username;
        }
        admin.email=req.body.email;
        admin.password=req.body.password;
        admin.created = new Date();
        let result=adminsApi.getAdmins({$or:[{email:admin.email},{name:admin.name}]})
        result.then(auths=>{
            if(auths.length!=0){
              req.flash('faild','该用户已经注册！');
              res.render('users/register')
            }else{
              adminsApi.addAdmin(admin).then(isSaved=>{
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
        req.logout();
        res.redirect('/admin/login');
    })


    //只有登录才能访问
    requireLogin=function(req,res,next){
      if(req.user){
        next();
      }else{
        res.redirect('/users/login');
        //next(new Error('登录用户才有权访问'));
      }
    }

    router.requireLogin=requireLogin;
    module.exports = router;
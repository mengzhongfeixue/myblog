
    const express = require('express');
    const router = express.Router();
    const authorsApi = require('../../models/authors');
    const { check, validationResult } = require('express-validator');
    const md5=require('md5');
    const passport = require('passport');

    const artsApi =require('../../models/articles');
    const catesApi = require('../../models/categories')
    //如果访问`/users`，重定向
    router.get('/',function(req,res,next){
        res.redirect('/users/login')
    })

    router.use('/:menu',function(req,res,next){
        res.locals.menu=req.params.menu;
        next();
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
        req.logout();
        res.redirect('/blog/articles');
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

    //个人中心

    //个人资料
    router.get('/data',function(req,res,next){
      requireLogin(req,res,next);
    },function(req,res,next){
      res.render('users/personalCenter/data',{user:req.user})
    })
    //个人资料修改
    router.get('/modifyData',function(req,res,next){
      requireLogin(req,res,next);
    },function(req,res,next){
      res.render('users/personalCenter/modifyData',{user:req.user})
    })
    //个人资料修改提交
    router.post('/edit/:_id', [
      // username must be an email
      check('email').isEmail().withMessage('请输入正确的邮箱'),
      // password must be at least 5 chars long
      check('password').isLength({ min: 6,max:15 }).withMessage('密码必须是六至十五位数字或字母')
    ], function(req,res,next){
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.render('users/personalCenter/modifyData',{errors:errors.errors})
      }else{
        authorsApi.updateAuthor(req.params,req.body).then(isUpdated=>{
          if(isUpdated.ok==1){
            req.flash('success','作者修改成功!');
            res.redirect(`/users/data`)
          }else{
            req.flash('failed','作者修改失败!');
          }
        })
      }
    })        
    //个人文章列表
    router.get('/articlesList',function(req,res,next){
      requireLogin(req,res,next);
    },function(req,res,next){
      require('../blog/articles').render(req,res,'users/personalCenter/articlesList','getArticles',{author:req.user})
    })    
    //个人添加文章
    router.get('/addArticle',function(req,res,next){
      requireLogin(req,res,next);
    },async function(req,res,next){
      let categories = await catesApi.getCategories();
      res.render('users/personalCenter/addArticle',{user:req.user,categories})
    })

    router.requireLogin=requireLogin;
    module.exports = router;
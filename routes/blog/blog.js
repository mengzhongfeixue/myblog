
    const express = require('express');
    const router = express.Router();
    const articlesRouter = require('./articles');

    //如果访问`/blog`，重定向到`/blog/articles`
    router.get('/',function(req,res,next){
        res.redirect('/blog/articles')
    })
    router.use('/:menu',function(req,res,next){
        res.locals.menu=req.params.menu;
        next();
    })
    router.use('/articles',articlesRouter) //用use实现子路由,不能使用get,get是错误的。
    router.get('/mark',function(req,res,next){
        res.render('blog/mark/index')
    })
    router.get('/community',function(req,res,next){
        res.render('blog/community/index')
    })
    router.get('/rank',function(req,res,next){
        res.render('blog/rank/index')
    })
    router.get('/about',function(req,res,next){
        res.render('blog/about/index')
    })

    module.exports = router;
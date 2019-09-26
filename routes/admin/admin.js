
    const express = require('express');
    const router = express.Router();
    const articlesRouter = require('./articles');
    const categoriesRouter = require('./categories');
    const authorsRouter = require('./authors');

    //如果访问`/admin`，重定向到`/admin/articles`
    router.get('/',function(req,res,next){
        res.redirect('/admin/articles')
    })

    //`/admin`下中间件，添加该路由下全局变量menu,用于侧边栏活动显示
    router.use('/:menu',function(req,res,next){ //用于文章管理侧边栏活动显示
      res.locals.menu=req.params.menu;
      next();
    })

    router.use('/articles',articlesRouter)
    router.use('/categories',categoriesRouter)
    router.use('/authors',authorsRouter) 

    module.exports = router;

    const express = require('express');
    const router = express.Router();
<<<<<<< HEAD
    const articlesRouter = require('./articles_bac');
=======
    const articlesRouter = require('./articles');
    const categoriesRouter = require('./categories');
    const authorsRouter = require('./authors');
>>>>>>> 后端管理基本部分完成

    //如果访问`/admin`，重定向到`/admin/articles`
    router.get('/',function(req,res,next){
        res.redirect('/admin/articles')
    })
<<<<<<< HEAD
 
    router.use('/articles',articlesRouter) 
=======

    //`/admin`下中间件，添加该路由下全局变量menu,用于侧边栏活动显示
    router.use('/:menu',function(req,res,next){ //用于文章管理侧边栏活动显示
      res.locals.menu=req.params.menu;
      next();
    })

    router.use('/articles',articlesRouter)
    router.use('/categories',categoriesRouter)
    router.use('/authors',authorsRouter) 
>>>>>>> 后端管理基本部分完成

    module.exports = router;
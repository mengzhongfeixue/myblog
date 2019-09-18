
    const express = require('express');
    const router = express.Router();
    const articlesRouter = require('./articles');

    //如果访问`/blog`，重定向到`/blog/articles`
    router.get('/',function(req,res,next){
        res.redirect('/blog/articles')
    })
 
    router.use('/articles',articlesRouter) //用use实现子路由,不能使用get,get是错误的。

    module.exports = router;
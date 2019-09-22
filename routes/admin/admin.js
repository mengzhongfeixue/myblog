
    const express = require('express');
    const router = express.Router();
    const articlesRouter = require('./articles_bac');

    //如果访问`/admin`，重定向到`/admin/articles`
    router.get('/',function(req,res,next){
        res.redirect('/admin/articles')
    })
 
    router.use('/articles',articlesRouter) 

    module.exports = router;
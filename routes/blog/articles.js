var express = require('express');
var router = express.Router();
var getArticlesBy = require('../../models/getArticlesBy');

var ga =require('../../models/getArticles'); 
var sd = require('silly-datetime');  //格式化日期时间
var truncate = require('truncate');  //截断文本（比如段落等）

/* GET users listing. */
    router.get('/',function(req,res,next){
        res.redirect('/blog')
    });
	router.get('/category', function(req, res, next) {
	      //定义渲染文章的方法
		  function getArt(arts,pN,pC){
              var title="我的分类站点";
		      //渲染到页面
		      res.render('blog/articles/category',{title:title,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories});
		  }

		  //定义获取所有文章分类的方法
		  let categories=[];
		  function getCat(cat){
              categories = cat;
		  }

          ga.getCategories(getCat);
		  getArticlesBy.getArticlesByCategory(req,res,getArt);
    });

	router.get('/author', function(req, res, next) {
	      //定义渲染文章的方法
		  function getArt(arts,pN,pC){
              var title="根据作者分类文章";
		      //渲染到页面
		      res.render('blog/articles/author',{title:title,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories});
		  }

		  //定义获取所有文章分类的方法
		  let categories=[];
		  function getCat(cat){
              categories = cat;
		  }

          ga.getCategories(getCat);
		  getArticlesBy.getArticlesByAuthor(req,res,getArt);
    });

    module.exports = router;
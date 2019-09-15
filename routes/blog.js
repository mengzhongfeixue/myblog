var express = require('express');
var router = express.Router();
var articlesRouter = require('./blog/articles');
//var getArticles = require('../models/getArticles'); 
var ga =require('../models/getArticles'); 
var sd = require('silly-datetime');  //格式化日期时间
var truncate = require('truncate');  //截断文本（比如段落等）
/* GET users listing. */
	router.get('/', function(req, res, next) {
	      //定义渲染文章的方法
		  function getArt(arts,pN,pC){
              var title="我的博客站点";

		      //渲染到页面
		      res.render('blog/home/index',{title:title,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories});
		  }

		  //定义获取所有文章分类的方法
		  let categories=[];
		  function getCat(cat){
              categories = cat;
		  }

          ga.getCategories(getCat);
		  ga.getArticles(req,res,getArt);
    });
 
    //router.use('/articles',articlesRouter);

module.exports = router;
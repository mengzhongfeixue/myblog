var express = require('express');
var router = express.Router();
var getArticlesBy = require('../../models/getArticlesBy');

var ga =require('../../models/getArticles'); 
var sd = require('silly-datetime');  //格式化日期时间
var truncate = require('truncate');  //截断文本（比如段落等）

/* GET users listing. */
    //定义公共内容
    let title = "";
    //定义获取所有文章分类的方法
	let categories=[];
	function getCat(cat){
        categories = cat;
    }
  
    //ga.getCategories(getCat);

    //如果访问`/blog/articles`，重定向到`/blog`
    router.get('/',function(req,res,next){
        res.redirect('/blog')
    });

    //定义`/articles/category`路由   (注意：路由中必须先加'/')
	router.get('/category', async function(req, res, next) {
		await ga.getCategories(getCat);
	    //定义渲染分类文章列表的方法
		function getArt(arts,pN,pC,name){
		    //渲染`views/blog/articles/category.jade`,并传相应参数
		    res.render('blog/articles/category',{title:name,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories});
		}

		await getArticlesBy.getArticlesByCategory(req,res,getArt);
    });

    //定义`/articles/author`路由
	router.get('/author', async function(req, res, next) {
        await ga.getCategories(getCat);

	    //定义渲染作者分类文章列表的方法
		function getArt(arts,pN,pC,name){

		    res.render('blog/articles/author',{title:name,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories});
		}

		await getArticlesBy.getArticlesByAuthor(req,res,getArt);
    });

    //定义`/articles/article`路由 (文章详情或标题slug跳转)
	router.get('/article', async function(req, res, next) {
		await ga.getCategories(getCat);
	    //定义渲染文章的方法
		function getArt(art){

		    res.render('blog/articles/article',{art:art,sd,categories});
		}

		await ga.getArticle(req,res,getArt);
    });

    //定义`/articles/article/meta`点赞路由
	router.get('/article/:meta', async function(req, res, next) {
		await ga.getCategories(getCat);
	    //定义渲染文章的方法
		function getArt(art){

		    res.render('blog/articles/article',{art:art,sd,categories});
		}

		await ga.updateFavoraties(req,res,getArt);
    });

    //定义`/articles/comment`评论路由
    router.post('/article/comment/:_id',async function(req, res, next) {
		await ga.getCategories(getCat);
	    //定义渲染文章的方法
		function getArt(art){

		    res.render('blog/articles/article',{art:art,sd,categories});
		}

		await ga.updateComments(req,res,getArt);
    });


    module.exports = router;
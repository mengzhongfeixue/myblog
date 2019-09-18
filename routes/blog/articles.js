var express = require('express');
var router = express.Router();

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

    router.get('/', async function(req, res, next) {

		await ga.getCategories(getCat);

	    //定义渲染文章的方法
		function getArt(arts,pN,pC){
            title="我的博客站点";
		    res.render('blog/home/index',{title:title,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories:categories});
		}

		await ga.getArticles(req,res,getArt);
    });

    //定义`/articles/category`通过分类获取该分类下文章的路由   (注意：路由中必须先加'/')
	router.get('/category', async function(req, res, next) {
		await ga.getCategories(getCat);
	    //定义渲染分类文章列表的方法
		function getArt(arts,pN,pC,name){
		    //渲染`views/blog/articles/category.jade`,并传相应参数
		    res.render('blog/articles/category',{title:name,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories});
		}

		await ga.getArticlesByCategory(req,res,getArt);
    });

    //定义`/articles/author`通过作者获取该作者笔下文章的路由
	router.get('/author', async function(req, res, next) {
        await ga.getCategories(getCat);

	    //定义渲染作者分类文章列表的方法
		function getArt(arts,pN,pC,name){

		    res.render('blog/articles/author',{title:name,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate,categories});
		}

		await ga.getArticlesByAuthor(req,res,getArt);
    });

    //定义`/articles/article`(文章详情或标题slug跳转)路由 
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
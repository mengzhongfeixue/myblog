const express = require('express');
const router = express.Router();
const artsApi =require('../../models/articles');
const catesApi = require('../../models/categories')

    //思路：从数据库获取文章 -> 分页 -> 模板渲染页面

    //定义拼接Json的方法,用于条件拼接后查询
    function joinJson(...vals){
      let result = {};
      for(let i=0;i<vals.length;i++){
        if(typeof(vals[i])=='object'){
          for(let key in vals[i]){
            result[key] = vals[i][key];
          }
        }
      }
      return result
    }

    //定义公共内容
    let title = "";
    let categories = [];
    let articles = [];

    //定义分页方法
    function paging(arts,pageNum){
      //pageNum = Math.abs(parseInt(req.query.page||1,10));//获取用户点击的页码
      const pageSize = 10;  //定义每页显示文章数
      let totalPages = arts.length;  //数据库中查询到的文章总数
      pageCount = Math.ceil(totalPages/pageSize); 
      arts = arts.slice((pageNum-1)*pageSize,pageNum*pageSize);
      return new Promise((resolve,reject)=>{
        resolve({arts:arts,pageCount:pageCount,pageNum:pageNum})
      })   
    }

    //定义公共的获取数据后渲染到页面的方法
    async function render(req,res,jade,getArticlesBy,condition={}){
      //先获取所有分类，下面渲染页面时，用于渲染网页右侧的文章分类
      categories= await catesApi.getCategories();
      //查询数据库找到符合条件的文章
      await artsApi[getArticlesBy](condition).then(docs=>{
        let pageNum=Math.abs(parseInt(req.query.page||1,10));
        return paging(docs,pageNum)
      }).then(meta=>{
        res.render(jade,{
          title,
          articles:meta.arts,
          pageNum:meta.pageNum,
          pageCount:meta.pageCount,
          categories:categories||[]
        })
      })        
    }

    //配置`/blog/articles`所有文章列表路由  
    router.get('/', function(req,res,next){
      render(req,res,'blog/home/index','getArticles',{published:true})
    }) 

    //定义`/articles/category`通过分类获取该分类下文章的路由   (注意：路由中必须先加'/')
    router.get('/category', function(req,res,next){
      //传入参数预处理
      let name = req.query.category||'Javascript';        
      let name_arr=name.trim().toLowerCase().split('');
      name_arr.splice(0,1,name_arr[0].toUpperCase()); //返回的是被替换后的那个数组元素，不是替换后数组不能链式编程。
      name= name_arr.join('');
      render(req,res,'blog/articles/category','getArticlesByCategoryForPublished',{name:name})
    })
    //定义`/articles/author`通过作者获取该作者笔下文章的路由
    router.get('/author', function(req,res,next){
      //传入参数预处理
      let name = req.query.author||'admin';        
      name.trim().toLowerCase(); 
      render(req,res,'blog/articles/author','getArticlesByAuthorForPublished',{name:name})     
    })
    //定义`/articles/article`(文章详情或标题slug跳转)路由
    router.get('/article', function(req,res,next){
      render(req,res,'blog/articles/article','getArticles',req.query)     
    })   

    //处理详情页点赞功能
    router.get('/article/:favorate', function(req,res,next){
      let con=joinJson({_id:req.query._id},{favorate:req.params.favorate})
      render(req,res,'blog/articles/article','updateFavoraties',con)     
    }) 
    //添加评论提交表单处理
    router.post('/article/comment/:_id', function(req,res,next){
      let con=joinJson({_id:req.params._id},{content:req.body})
      render(req,res,'blog/articles/article','updateComments',con)     
    }) 
    //搜索文章
    router.post('/search',function(req,res,next){
      let search = {};
      search.title=new RegExp(req.body.keyword.trim(),'i');
      render(req,res,'blog/home/index','getArticles',joinJson(search,{published:true}))
    })
    //添加文章
    router.get('/add',function(req,res,next){
      require('../users/users').requireLogin(req,res,next)
    },function(req,res,next){
      res.write('hahha')
    })

    //设置中间件，只有用户才能访问
    requireLogin=function(req,res,next){
      if(req.user){
        next();
      }else{
        next(new Error('登录用户才有权访问'))
      }
    }

    
    module.exports = router;  
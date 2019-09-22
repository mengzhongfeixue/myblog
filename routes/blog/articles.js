const express = require('express');
const router = express.Router();

//const ga =require('../../models/getArticles'); 
const ga =require('../../models/articles/operateArticlesData/getArticles');
const sd = require('silly-datetime');  //格式化日期时间
const truncate = require('truncate');  //截断文本（比如段落等）

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

    //定义公共的从数据库获取文章的方法
    async function getData(req,getArticlesBy){
      //先获取所有分类，下面渲染页面时，用于渲染网页右侧的文章分类
      categories= await ga.getCategories();
      //查询数据库找到符合条件的文章
      if(req.method.toLowerCase()=='get'){     
        if(Object.keys(req.params).length!=0){   //对象不能用length获取长度
           return await ga[getArticlesBy](joinJson(req.query,req.params))
        }else{ 
          if(req.query.category){
            //传入参数预处理
            let name = req.query.category||'Javascript';        
            let name_arr=name.trim().toLowerCase().split('');
            name_arr.splice(0,1,name_arr[0].toUpperCase()); //返回的是被替换后的那个数组元素，不是替换后数组不能链式编程。
            name= name_arr.join('');
            // name=name.replace(name[0],name[0].toUpperCase()).trim()||"";  //该方法把中间与首字母相同的字母也大写了不可取。
             return await ga[getArticlesBy]({name:name})
          }else if(req.query.author){
            //传入参数预处理
            let name = req.query.author||'admin';        
            name.trim().toLowerCase();
             return await ga[getArticlesBy]({name:name})
          }else if(req.query.page){
             return await ga[getArticlesBy]()
          }else{
             return await ga[getArticlesBy](req.query) 
          }                   
        }
      }
      if(req.method.toLowerCase()=='post'){
        if(Object.keys(req.params).length!=0){
           return await ga[getArticlesBy](joinJson(req.body,req.params))
        }else{
           return await ga[getArticlesBy](req.body)          
        }
      }        
    }
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

    //定义渲染页面的方法
    function render(res,jade,articles,pN=1,pC=1){
      res.render(jade,{title,articles,pageNum:pN,pageCount:pC,sd,truncate,categories});
    }

    //配置`/blog/articles`所有文章列表路由  
    router.get('/', function(req,res,next){
      getData(req,'getArticles').then(docs=>{
        let pageNum=Math.abs(parseInt(req.query.page||1,10));
        return paging(docs,pageNum)
      }).then(meta=>{
        render(res,'blog/home/index',meta.arts,meta.pageNum,meta.pageCount)
      })
    }) 

    //定义`/articles/category`通过分类获取该分类下文章的路由   (注意：路由中必须先加'/')
    router.get('/category', function(req,res,next){
      getData(req,'getArticlesByCategory').then(docs=>{
        let pageNum=Math.abs(parseInt(req.query.page||1,10));
        return paging(docs,pageNum)
      }).then(meta=>{
        render(res,'blog/articles/category',meta.arts,meta.pageNum,meta.pageCount)
      })
    })
    //定义`/articles/author`通过作者获取该作者笔下文章的路由
    router.get('/author', function(req,res,next){
      getData(req,'getArticlesByAuthor').then(docs=>{
        let pageNum=Math.abs(parseInt(req.query.page||1,10));
        return paging(docs,pageNum)
      }).then(meta=>{
        render(res,'blog/articles/author',meta.arts,meta.pageNum,meta.pageCount)
      })
    })
    //定义`/articles/article`(文章详情或标题slug跳转)路由
    router.get('/article', function(req,res,next){
      getData(req,'getArticles').then(docs=>{
        render(res,'blog/articles/article',docs)
      })
    })    

    //处理详情页点赞功能
    router.get('/article/:meta', function(req,res,next){
      getData(req,'updateFavoraties').then(docs=>{
        render(res,'blog/articles/article',docs)
      })
    }) 
    //添加评论提交表单处理
    router.post('/article/comment/:_id', function(req,res,next){
      getData(req,'updateComments').then(docs=>{
        render(res,'blog/articles/article',docs)
      })
    }) 

    
    module.exports = router;  
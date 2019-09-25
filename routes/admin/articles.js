const express = require('express');
const router = express.Router();

<<<<<<< HEAD
const getArts =require('../../models/articles/operateArticlesData/getArticles');
const delArt =require('../../models/articles/operateArticlesData/deleteArticle'); 
const sd = require('silly-datetime');  //格式化日期时间
const truncate = require('truncate');  //截断文本（比如段落等）


=======
const artsApi = require('../../models/articles');
const catesApi = require('../../models/categories');
const authorsApi = require('../../models/authors');
>>>>>>> 后端管理基本部分完成

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
    let title = "文章管理";
<<<<<<< HEAD

    //定义公共的从数据库获取文章的方法
    async function getData(req,operation,item){
      //查询数据库找到符合条件的文章
      if(req.method.toLowerCase()=='get'){     
        if(Object.keys(req.params).length!=0){   //对象不能用length获取长度
          if(req.params.sortby){
            return await operation[item](joinJson(req.query,req.params))
          }
        }else{ 
          if(req.query.category){
            //传入参数预处理
            let name = req.query.category||'Javascript';        
            let name_arr=name.trim().toLowerCase().split('');
            name_arr.splice(0,1,name_arr[0].toUpperCase()); //返回的是被替换后的那个数组元素，不是替换后数组不能链式编程。
            name= name_arr.join('');
            // name=name.replace(name[0],name[0].toUpperCase()).trim()||"";  //该方法把中间与首字母相同的字母也大写了不可取。
             return await operation[item]({name:name})
          }else if(req.query.author){
            //传入参数预处理
            let name = req.query.author||'admin';        
            name.trim().toLowerCase();
             return await operation[item]({name:name})
          }else if(req.query._id&&req.query.sortby){ //删除
             return await operation[item]({_id:req.query._id})
          }else if(req.query.sortby){  //排序
            let sort={};
            sort[req.query.sortby]=req.query.sortdir;
            return await operation[item](sort);           
          }else if(req.query.page){
             return await operation[item]()
          }else{
             return await operation[item](req.query) 
          }                   
        }
      }
      if(req.method.toLowerCase()=='post'){
        if(Object.keys(req.params).length!=0){
           return await operation[item](joinJson(req.body,req.params))
        }else{
           return await operation[item](req.body)          
        }
      }        
    }
=======
    let categories = [];
    let authors = [];

>>>>>>> 后端管理基本部分完成
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

<<<<<<< HEAD
    //定义渲染页面的方法
    function render(res,jade,articles,pN=1,pC=1,sortby='created',sortdir='desc'){
      res.render(jade,{title,articles,pageNum:pN,pageCount:pC,sd,truncate,sortby,sortdir});
    }

    //配置`/admin/articles`所有文章列表路由  
    router.get('/', function(req,res,next){
      getData(req,getArts,'getArticles').then(docs=>{
        let pageNum=Math.abs(parseInt(req.query.page||1,10));
        return paging(docs,pageNum)
      }).then(meta=>{
        render(res,'admin/articles/index',meta.arts,meta.pageNum,meta.pageCount)
      })
    }) 

    //点击编辑
    router.get('/edit/:id',function(req,res,next){
      //todo
    })
    //编辑页提交
    router.get('/edit/:id',function(req,res,next){
      //todo
=======
    //定义渲染文章列表页面的方法
    async function render(req,res,jade,getArticles='getArticles',condition={}){
      categories = await catesApi.getCategories(); 
      authors = await authorsApi.getAuthors();
      await artsApi[getArticles](condition).then(docs=>{
        let pageNum=Math.abs(parseInt(req.query.page||1,10));
        return paging(docs,pageNum)
      }).then(meta=>{
        res.render(jade,{
          title,
          articles:meta.arts,
          pageNum:meta.pageNum,
          pageCount:meta.pageCount,
          sortby:req.query.sortby||'created',
          sortdir:req.query.sortdir||'desc',
          categories:categories||[],
          authors:authors||[]
        })
      })             
    } 


    //`/admin/articles`所有文章列表路由  
    router.get('/',function(req,res,next){
      render(req,res,'admin/articles')
    })       

    //按表头排序
    router.get('/sort',function(req,res,next){
      let sort={};
      sort[req.query.sortby]=req.query.sortdir;
      render(req,res,'admin/articles','sortArticles',sort)
    })

    //筛选文章
    router.post('/filter',function(req,res,next){
      if(req.body.category&&req.body.author){
        //render(req,res,'admin/articles','getArticlesByBoth',{
         // 'category._id':req.body.category,
         // 'author._id':req.body.author
        //}) 
        (async ()=>{
          categories = await catesApi.getCategories(); 
          authors = await authorsApi.getAuthors();
          await artsApi.getArticlesByBoth({
          'category._id':req.body.category,
          'author._id':req.body.author
          },(docs)=>{
            let pageNum=Math.abs(parseInt(req.query.page||1,10));
            paging(docs,pageNum).then(meta=>{
              res.render('admin/articles',{
                title,
                articles:meta.arts,
                pageNum:meta.pageNum,
                pageCount:meta.pageCount,
                sortby:req.query.sortby||'created',
                sortdir:req.query.sortdir||'desc',
                categories:categories,
                authors:authors
              })
            })
          })               
        })()


      }else if(req.body.category){
        render(req,res,'admin/articles','getArticlesByCategory',{_id:req.body.category})
      }else if(req.body.author){
        render(req,res,'admin/articles','getArticlesByAuthor',{_id:req.body.author})
      }else{
        render(req,res,'admin/articles')
      }
    }) 

    //点击编辑
    router.get('/edit', function(req,res,next){      
      render(req,res,'admin/addArticle','getArticles',req.query)
    })
    //编辑页提交
    router.post('/edit/:_id',function(req,res,next){
      //console.log(req.params,req.body)
      artsApi.updateArticle(req.params,req.body,isUpdated=>{
        if(isUpdated=='ok'){
          req.flash('success','文章修改成功!');
          res.redirect(`/admin/articles`)
        }else{
          req.flash('failed','文章修改失败!');
          res.redirect(`/admin/articles/edit?page=${req.params.page}`)
        }
      })
>>>>>>> 后端管理基本部分完成
    })
    //删除文章
    router.get('/delete',function(req,res,next){
      //todo
<<<<<<< HEAD
      getData(req,delArt,'deleteArticle').then(isRemoved=>{
=======
     artsApi.deleteArticle({_id:req.query._id}).then(isRemoved=>{
>>>>>>> 后端管理基本部分完成
        if(isRemoved.ok){
          req.flash('success','文章删除成功!');
        }else{
          req.flash('failed','文章删除失败')
        }
        res.redirect(`/admin/articles/sort?page=${req.query.page}&sortby=${req.query.sortby}&sortdir=${req.query.sortdir}`)
      })
<<<<<<< HEAD
    })

    //按表头排序
    router.get('/sort',function(req,res,next){
      getData(req,getArts,'sortArticles').then(docs=>{
        let pageNum=Math.abs(parseInt(req.query.page||1,10));
        return paging(docs,pageNum)
      }).then(meta=>{
        render(res,'admin/articles/index',meta.arts,meta.pageNum,meta.pageCount,req.query.sortby,req.query.sortdir);
      })
    })
=======
    })          
>>>>>>> 后端管理基本部分完成

    
    module.exports = router;  
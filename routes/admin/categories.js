const express = require('express');
const router = express.Router();

  const catesApi =require('../../models/categories'); 

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
    let title = "分类管理";
    let categories = [];

    //定义分页方法
    function paging(cates,pageNum=1){
      const pageSize = 10;  //定义每页显示文章数
      let totalPages = cates.length;  //数据库中查询到的分类总数
      pageCount = Math.ceil(totalPages/pageSize); 
      cates = cates.slice((pageNum-1)*pageSize,pageNum*pageSize);
      return new Promise((resolve,reject)=>{
        resolve({cates:cates,pageCount:pageCount,pageNum:pageNum})
      })   
    }

    //定义渲染文章列表页面的方法
    async function render(req,res,jade,getCategoriesBy="getCategories",condition={}){
      categories = await catesApi.getCategories(); //用于筛选的选择列表
      let cates=await catesApi[getCategoriesBy](condition);     
      let pageNum=Math.abs(parseInt(req.query.page||1,10));
      paging(cates,pageNum).then(meta=>{
        res.render(jade,{
          title,
          cates:meta.cates,
          pageNum:meta.pageNum,
          pageCount:meta.pageCount,
          sortby:req.query.sortby||'created',
          sortdir:req.query.sortdir||'desc',
          categories:categories||[]
        })
      })             
    } 



    //`/admin/categories`所有分类列表路由  
    router.get('/',function(req,res,next){
      render(req,res,'admin/categories')
    })       
    router.post('/filter',async function(req,res,next){
      render(req,res,'admin/categories','getCategories',req.body)
    })
    router.get('/sort',function(req,res,next){
      let sort={};
      sort[req.query.sortby]=req.query.sortdir;
      render(req,res,'admin/categories','sortCategories',sort)
    })

    //点击编辑
    router.get('/edit', function(req,res,next){
      catesApi.getCategories(req.query).then(cates=>{
        res.render('admin/addCategory',{category:cates[0]})
      })      
      
    })
    //编辑页提交
    router.post('/edit/:_id',function(req,res,next){
      //console.log(req.params,req.body)
      artsApi.updateArticle(req.params,req.body,isUpdated=>{
        if(isUpdated=='ok'){
          req.flash('success','分类修改成功!');
          res.redirect(`/admin/articles`)
        }else{
          req.flash('failed','分类修改失败!');
          res.redirect(`/admin/categories/edit?page=${req.params.page}`)
        }
      })
    })
    //删除分类
    router.get('/delete',function(req,res,next){
      //todo
     catesApi.deleteCategory({_id:req.query._id}).then(isRemoved=>{
        if(isRemoved.ok){
          req.flash('success','分类删除成功!');
        }else{
          req.flash('failed','分类删除失败！')
        }
        res.redirect(`/admin/categories/sort?page=${req.query.page}&sortby=${req.query.sortby}&sortdir=${req.query.sortdir}`)
      })
    }) 


    //点击添加
    router.get('/add', function(req,res,next){      
      res.render('admin/addCategory')
    }) 
    
    //添加分类
    router.post('/add',function(req,res,next){
      catesApi.addCategory(req.body).then(isSaved=>{
        if(isSaved.ok=1){
          req.flash('success','分类添加成功!');
          res.redirect('/admin/categories')
        }else{
          req.flash('field','分类添加失败!');
          res.render('admin/addCategory')
        }
      })
      
    })

    
    module.exports = router;  
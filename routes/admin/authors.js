const express = require('express');
const router = express.Router();

const authorsApi =require('../../models/authors'); 
const { check, validationResult } = require('express-validator');


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
    let title = "作者管理";
    let authors = [];

    //定义分页方法
    function paging(authors,pageNum=1){
      const pageSize = 10;  //定义每页显示文章数
      let totalPages = authors.length;  //数据库中查询到的作者总数
      pageCount = Math.ceil(totalPages/pageSize); 
      authors = authors.slice((pageNum-1)*pageSize,pageNum*pageSize);
      return new Promise((resolve,reject)=>{
        resolve({authors:authors,pageCount:pageCount,pageNum:pageNum})
      })   
    }

    //定义渲染文章列表页面的方法
    async function render(req,res,jade,getAuthorsBy="getAuthors",condition={}){
      authors = await authorsApi.getAuthors(); //用于筛选的选择列表
      let auths=await authorsApi[getAuthorsBy](condition);   
      let pageNum=Math.abs(parseInt(req.query.page||1,10));
      paging(auths,pageNum).then(meta=>{
        res.render(jade,{
          title,
          auths:meta.authors,
          pageNum:meta.pageNum,
          pageCount:meta.pageCount,
          sortby:req.query.sortby||'created',
          sortdir:req.query.sortdir||'desc',
          authors:authors||[]
        })
      })             
    } 



    //`/admin/authors`所有作者列表路由  
    router.get('/',function(req,res,next){
      render(req,res,'admin/authors')
    })       
    router.post('/filter',async function(req,res,next){
      if(req.body._id==''){
        delete req.body['_id']
      }
      render(req,res,'admin/authors','getAuthors',req.body)
    })
    router.get('/sort',function(req,res,next){
      let sort={};
      sort[req.query.sortby]=req.query.sortdir;
      render(req,res,'admin/authors','sortAuthors',sort)
    })

    //点击编辑
    router.get('/edit', function(req,res,next){
      authorsApi.getAuthors(req.query).then(authors=>{
        res.render('admin/addAuthor',{edit:'edit',author:authors[0]})
      })      
      
    })
    //编辑页提交
    router.post('/edit/:_id', [
      // username must be an email
      check('email').isEmail().withMessage('请输入正确的邮箱'),
      // password must be at least 5 chars long
      check('password').isLength({ min: 6,max:15 }).withMessage('密码必须是六至十五位数字或字母')
    ], function(req,res,next){
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.render('admin/addAuthor',{errors:errors.errors})
      }else{
        authorsApi.updateAuthor(req.params,req.body).then(isUpdated=>{
          if(isUpdated.ok==1){
            req.flash('success','作者修改成功!');
            res.redirect(`/admin/authors`)
          }else{
            req.flash('failed','作者修改失败!');
          }
        })
      }
    })
    //删除作者
    router.get('/delete',function(req,res,next){
      //todo
     authorsApi.deleteAuthor({_id:req.query._id}).then(isRemoved=>{
        if(isRemoved.ok){
          req.flash('success','作者删除成功!');
        }else{
          req.flash('failed','作者删除失败！')
        }
        res.redirect(`/admin/authors/sort?page=${req.query.page}&sortby=${req.query.sortby}&sortdir=${req.query.sortdir}`)
      })
    }) 


    //点击添加
    router.get('/add', function(req,res,next){      
      res.render('admin/addAuthor')
    }) 
    
    //添加作者
    router.post('/add', [
      // username must be an email
      check('email').isEmail().withMessage('请输入正确的邮箱'),
      // password must be at least 5 chars long
      check('password').isLength({ min: 6,max:15 }).withMessage('密码必须是六至十五位数字或字母')
    ], function(req,res,next){

      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.render('admin/addAuthor',{errors:errors.errors})
      }else{
        authorsApi.addAuthor(req.body).then(isSaved=>{
          if(isSaved.ok=1){
            req.flash('success','作者添加成功!');
            res.redirect('/admin/authors')
          }else{
            req.flash('faild','作者添加失败！');
            res.render('admin/addAuthor')
          }
        })
      }


      
    })

    
    module.exports = router;  
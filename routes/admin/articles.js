
const express = require('express');
const router = express.Router();
const ga = require('../../models/getArticles');
const deleteArticle = require('../../models/deleteArticle');
const sd = require('silly-datetime');  //格式化日期时间
const truncate = require('truncate');  //截断文本（比如段落等）

  //文章管理首页路由
  router.get('/', function(req, res, next) {
    //定义渲染文章的方法
    function getArt(arts,pN,pC){
      const title="文章管理列表";
      res.render('admin/articles/index',{title:title,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate});
    }

    ga.getArticles(req,res,getArt);
  });

  //删除文章路由
  router.get('/delete', function(req, res, next) {

    function getArt(arts,pN,pC){
      const title="文章管理列表";
      res.render('admin/articles/index',{title:title,articles:arts,pageNum:pN,pageCount:pC,sd:sd,truncate:truncate});
    }
    deleteArticle(req,res,getArt);
  });


module.exports = router;
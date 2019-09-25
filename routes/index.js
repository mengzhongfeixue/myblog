var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '我的博客站点入口' });
<<<<<<< HEAD
=======

  //这里用于开发中测试
  //console.log('req.url:',req.path)





>>>>>>> 后端管理基本部分完成
});

module.exports = router;

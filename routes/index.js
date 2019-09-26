var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '我的博客站点入口' });

  //这里用于开发中测试
  //console.log('req.url:',req.path)





});

module.exports = router;

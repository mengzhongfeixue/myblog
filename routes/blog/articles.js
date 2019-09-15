var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('blog/articles/index', { title: '我的博文' });
});

module.exports = router;
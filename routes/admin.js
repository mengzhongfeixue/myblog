var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index',{title:'管理界面标题'});
});

module.exports = router;
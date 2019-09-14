var express = require('express');
var router = express.Router();
var getArticles = require('../models/getArticles');

/* GET users listing. */
    
	router.get('/', function(req, res, next) {
      function getArt(doc){
          res.render('blog/index',{articles:doc});
      }
      getArticles(getArt);
    });

module.exports = router;
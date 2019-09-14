var express = require('express');
var router = express.Router();
//var getArticles = require('../models/getArticles');  //开发中暂不频繁访问数据库
var sd = require('silly-datetime');
/* GET users listing. */
    
	router.get('/', function(req, res, next) {
	  //下面暂用数据库取到的静态数据
	  var temporary= [ { published: true,
				    comments: [],
				    _id: '5d7b520673815a3d38835a4c',
				    title: 'First blogger about Javascript',
				    slug: 'first javascript',
				    content: ' javascript blogger content',
				    category:
				     { _id: '5d7b4959ff4af0207404cc97',
				       name: 'Javascript',
				       slug: 'javascript',
				       created: '2019-09-13T07:46:33.612Z',
				       __v: 0 },
				    author:
				     { _id: '5d7a51b7e0fbee0ff0ee70c7',
				       name: 'admin',
				       email: 'admin@nodeblog.io',
				       password: '000000',
				       created: '2019-09-12T14:09:59.547Z',
				       __v: 0 },
				    meta: { favourates: 0 },
				    created: '2019-09-13T08:23:34.368Z',
				    __v: 0 },
				  { published: true,
				    comments: [],
				    _id: '5d7b52e378df642fa07d0b70',
				    title: 'First blogger about Html',
				    slug: 'first-blogger-about-html',
				    content: ' Html blogger content',
				    category:
				     { _id: '5d7b49c5da5dbf1cb030bce4',
				       name: 'Html',
				       slug: 'html',
				       created: '2019-09-13T07:48:21.556Z',
				       __v: 0 },
				    author:
				     { _id: '5d7a51b7e0fbee0ff0ee70c7',
				       name: 'admin',
				       email: 'admin@nodeblog.io',
				       password: '000000',
				       created: '2019-09-12T14:09:59.547Z',
				       __v: 0 },
				    meta: { favourates: 0 },
				    created: '2019-09-13T08:27:15.115Z',
				    __v: 0 },
				  { published: true,
				    comments: [],
				    _id: '5d7b5334f9ab60396cab21d7',
				    title: 'First blogger about Css',
				    slug: 'first-blogger-about-css',
				    content: ' Css blogger content',
				    category:
				     { _id: '5d7b49e658616f3d44b3d562',
				       name: 'Css',
				       slug: 'css',
				       created: '2019-09-13T07:48:54.104Z',
				       __v: 0 },
				    author:
				     { _id: '5d7a51b7e0fbee0ff0ee70c7',
				       name: 'admin',
				       email: 'admin@nodeblog.io',
				       password: '000000',
				       created: '2019-09-12T14:09:59.547Z',
				       __v: 0 },
				    meta: { favourates: 0 },
				    created: '2019-09-13T08:28:36.511Z',
				    __v: 0 },
				  { published: true,
				    comments: [],
				    _id: '5d7b5389e308183b444f3c5e',
				    title: 'First blogger about Vue',
				    slug: 'first-blogger-about-vue',
				    content: ' Vue blogger content',
				    category:
				     { _id: '5d7b4a29994cdd1bb8896dd2',
				       name: 'Vue',
				       slug: 'vue',
				       created: '2019-09-13T07:50:01.080Z',
				       __v: 0 },
				    author:
				     { _id: '5d7a51b7e0fbee0ff0ee70c9',
				       name: '王五',
				       email: '530545fd@126.com',
				       password: '666666',
				       created: '2019-09-12T14:09:59.566Z',
				       __v: 0 },
				    meta: { favourates: 0 },
				    created: '2019-09-13T08:30:01.737Z',
				    __v: 0 } 
				];
      function getArt(doc){
          res.render('blog/index',{articles:doc,sd:sd});
      }
      getArt(temporary);
      //getArticles(getArt);
    });

module.exports = router;
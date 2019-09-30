var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const session = require('express-session');
const connectFlash= require('connect-flash'); //跨对话消息传递
const messages = require('express-messages');
const passport = require('passport');
const passportConfig=require('./passport_config');
const mongoose = require('./models/db.js');
const MongoStore = require('connect-mongo')(session);
const sd = require('silly-datetime');  //格式化日期时间的方法的插件
const truncate = require('truncate');  //截断文本(比如段落等)的方法的插件

var indexRouter = require('./routes/index');
var blogRouter = require('./routes/blog/blog');
var adminRouter = require('./routes/admin/admin');
const usersRouter = require('./routes/users/users');

var authorsApi = require('./models/authors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//post请求的req.body解析的第三方插件body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(session({
  secret: 'blog',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  //connect-mongo(数据库保存会话插件)的会话配置
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
//登录验证passport策略和会话配置
app.use(function(req,res,next){
  passportConfig.init();
  next();
});
//登录验证passport中间件配置
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  req.user = null;
  if(req.session.passport&&req.session.passport.user){
    authorsApi.AuthorModel.findOne({_id:req.session.passport.user},function(err,user){
      if(err){
        return next(err)
      }
      user.password = null;
      req.user = user;
      next();
    })
  }else{
    next();
  }
});
//跨会话通知connect-flash中间件使用
app.use(connectFlash());
app.use(function(req,res,next){
  res.locals.messages=messages(req,res);
  app.locals.user=req.user;
  console.log(req.session)
  next();
});

//第三方插件日期时间处理方法和截取字符串方法注册到全局，方便公用。
app.use(function(req,res,next){
  res.locals.sd = sd;
  res.locals.truncate = truncate;
  next();
});

app.use('/', indexRouter);
app.use('/users',usersRouter);
app.use('/blog', blogRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};




    
    //此种方式不可取，异步原因可能导致后面使用到categories时，数据库还没查到。
	// categoryModel.find(function(err,categories){
	// 	if(err){
	// 		return next(err);
	// 	}
	// 	app.locals.categories = categories;
	// 	next();
	// })
    
  

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

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
const sd = require('silly-datetime');  //格式化日期时间的方法的插件
const truncate = require('truncate');  //截断文本(比如段落等)的方法的插件

var indexRouter = require('./routes/index');
var blogRouter = require('./routes/blog/blog');
var adminRouter = require('./routes/admin/admin');
const usersRouter = require('./routes/users/users');

//var categoryModel = require('./models/category');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(session({
  secret: 'blog',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
//app.use(passport.initialize());
//app.use(passport.session());
app.use(connectFlash());
app.use(function(req,res,next){
  res.locals.messages=messages(req,res);
  next();
});


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

//通过lorem-ipsum第三方插件生成随机的文章内容
var {loremIpsum} = require('lorem-ipsum'),
    slug = require('slug'), //用于SEO优化
    UserModel = require('./user'),
    CategoryModel = require('./category'),
    ArticleModel = require('./article');

UserModel.findOne(function(err,user){
	if(err){
		return  console.log(err);
	}
	CategoryModel.find(function(err,categories){
		if(err){
			return console.log(err);
		}
		categories.forEach(function(category){
			for(var i=0;i<45;i++){
			    var title = loremIpsum({ count:1,units:'sentences'});
				var article = new ArticleModel({
					title:title,
					slug:slug(title),
					content:loremIpsum({count:3,units:'paragraphs'}),
					category:category,
					author:user,
					published:true,
					meta:{ favoraites: 0},
					comments:[],
					created: new Date()
				});
				article.save(function(err,art){
					if(err){
						console.log(err);
					}
					console.log('save article:', art.slug)
				})	
			}			
		});
	})
})

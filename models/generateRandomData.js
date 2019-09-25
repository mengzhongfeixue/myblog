//通过lorem-ipsum第三方插件生成随机的文章内容
var {loremIpsum} = require('lorem-ipsum'),
    slug = require('slug'), //用于SEO优化
    authorsApi= require('./authors'),
    catesApi= require('./categories'),
    artsApi= require('./articles');


function generater(){
	for(let i=0;i<5;i++){
	let name = loremIpsum({ count:1,units:'words'})
	let u=new authorsApi.AuthorModel({ //实例化模型传入增加的数据
		name:name,
		email:i+'nm'+i*77+'cba'+42+'@qq.com',
		password:'000000',
        created:new Date()
	})
	u.save();
	}
	for(let i=0;i<3;i++){
		let name = loremIpsum({ count:1,units:'words'})
		let u=new catesApi.CategoryModel({ //实例化模型传入增加的数据
			name: 'Cate-'+name,
			slug:slug(name),
            created:new Date()
		})
		u.save();
	}

	authorsApi.AuthorModel.find(function(err,authors){
		if(err){
			return  console.log(err);
		}
		authors.forEach(function(author){
			if(err){
				return console.log(err);
			}
			catesApi.CategoryModel.find(function(err,categories){
				if(err){
					return console.log(err);
				}
				categories.forEach(function(category){
					for(var i=0;i<20;i++){
					    var title = loremIpsum({ count:1,units:'sentences'});
						var article = new artsApi.ArticleModel({
							title:title,
							slug:slug(title),
							content:loremIpsum({count:3,units:'paragraphs'}),
							category:category,
							author:author,
							published:loremIpsum({words:['true','false']}),
							meta:{ favoraties: 0},
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
				})
			})
		})
	})
}

generater();

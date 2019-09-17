
    var ArticleModel=require('./article.js');
    var CategoryModel = require('./category.js');
    var UserModel = require('./user.js');

    async function getArticlesByCategory(req,res,callback){
        
        //传入参数预处理
        let name = req.query.category||'Javascript';        
    	let name_arr=name.trim().toLowerCase().split('');
    	name_arr.splice(0,1,name_arr[0].toUpperCase()); //返回的是被替换后的那个数组元素，不是替换后数组不能链式编程。
    	name= name_arr.join('');
      // name=name.replace(name[0],name[0].toUpperCase()).trim()||"";  //该方法把中间与首字母相同的字母也大写了不可取。

        //分页
        let pageNum = Math.abs(parseInt(req.query.page)||1,10); //获取用户点击的页码
        const pageSize = 10;  //定义每页显示文章数
        let totalCount = 1;  //数据库中查询到的文章总数
        let pageCount = 1;
        await CategoryModel.find({name:name},function(err,cate){
	                 ArticleModel.countDocuments({category:cate,published:true},function(err,sum){
	                 	 totalCount=sum;
	                 	 pageCount = Math.ceil(totalCount/pageSize);
	                   if(pageNum>pageCount){ //用户选择了多于可显示页数时显示最后一页
	                        pageNum = pageCount;
	                   }
		             });
        })
       
		await CategoryModel.find({name:name},function(err,category){
	      	ArticleModel.find({category:category,published:true})
	      	            .populate('author')
                        .populate('category')
                        .sort('created')
                        .skip(pageSize*(pageNum-1))
                        .limit(pageSize)
                        .exec(function(err,arts){
                        	//console.log(arts,pageNum,pageCount)
                        	callback(arts,pageNum,pageCount) 
                        });              
	    })

    }

    async function getArticlesByAuthor(req,res,callback){
        
        //传入参数预处理
        let name = req.query.author||'admin';        
    	name.trim().toLowerCase();

        //分页
        let pageNum = Math.abs(parseInt(req.query.page)||1,10); //获取用户点击的页码
        const pageSize = 10;  //定义每页显示文章数
        let totalCount = 1;  //数据库中查询到的文章总数
        let pageCount = 1;
        await UserModel.find({name:name},function(err,author){
  	               ArticleModel.countDocuments({author:author,published:true},function(err,sum){
  	                 	 totalCount=sum;
  	                 	 pageCount = Math.ceil(totalCount/pageSize);
		                 if(pageNum>pageCount){ //用户选择了多于可显示页数时显示最后一页
		                      pageNum = pageCount;
		                 }				      	        
			       });
        })
       
		await UserModel.find({name:name},function(err,author){
			      	ArticleModel.find({author:author,published:true})
			      	            .populate('author')
		                        .populate('category')
		                        .sort('created')
		                        .skip(pageSize*(pageNum-1))
		                        .limit(pageSize)
		                        .exec(function(err,arts){
		                        	//console.log(arts,pageNum,pageCount)
		                        	callback(arts,pageNum,pageCount) 
		                        });              
	    })

    }




    module.exports={
    	getArticlesByCategory,
    	getArticlesByAuthor
    }

	   



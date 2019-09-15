 
    //Article 中添加数据
    var ArticleModel=require('./article.js');
    var CategoryModel = require('./category.js');
    var UserModel = require('./user.js');
  


    
       //获取文章
        async function getArticles(req,res,next){
        //分页
        let pageNum = Math.abs(parseInt(req.query.page||1,10)); //获取用户点击的页码
        const pageSize = 10;  //定义每页显示文章数
        let totalCount = 0;  //数据库中查询到的文章总数
        totalCount=await ArticleModel.find({published:true}).countDocuments();
        let pageCount = Math.ceil(totalCount/pageSize);
        if(pageNum>pageCount){ //用户选择了多于可显示页数时显示最后一页
              pageNum = pageCount;
            }
        let arts=await ArticleModel.find({published:true})
                   .populate('author')
                   .populate('category')
                   .sort('created')
                   .skip(pageSize*(pageNum-1))
                   .limit(pageSize)
                   .exec();  
        next(arts,pageNum,pageCount);       
      }
 
      //获取分类
       async function getCategories(callback){
        let gc = await CategoryModel.find().exec();
        callback(gc);
      }
    

      module.exports={
        getArticles,
        getCategories
      } 
       
 
  
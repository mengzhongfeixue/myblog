 
    //Article 中添加数据
    var ArticleModel=require('./article.js');
    var CategoryModel = require('./category.js');
    var UserModel = require('./user.js');
  

    
      //获取所有文章
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

      //获取文章内容详情页
      function getArticle(req,res,next){
        ArticleModel.find(req.query)
                   .populate('author')
                   .populate('category')
                   .exec(function(err,doc){
                      if(err){
                        return next(err)
                      }
                      next(doc[0])                                           
                    });      
      }

      //处理详情页点赞功能
      function updateFavoraties(req,res,next){
        ArticleModel.find(req.query)
                   .populate('author')
                   .populate('category')
                   .exec(function(err,doc){
                      if(req.params.meta){
                        doc[0].meta.favoraites++;
                        doc[0].markModified('meta'); //旧版本mongoose修改数据库中嵌套的复杂数据(比如：数组，嵌套对象和复杂类型数据等)时要先标记再保存
                        doc[0].save(function(err,art){
                          next(art)
                        })                                                
                      }                                                                
                    });      
      }
      
      //添加评论
      function updateComments(req,res,next){
        ArticleModel.findOne({_id: req.params._id})
                   .populate('author')
                   .populate('category')
                   .exec(function(err,doc){
                      if(req.body.content){
                        let comment ={
                          uid:req.body.user_id,
                          content:req.body.content,
                          created:new Date()
                        }
                        doc.comments.unshift(comment); 
                        //doc.markModified('comments'); 以前版本要标记了后面保存才会修改数据库中的‘数组’。
                        doc.save(function(error,art){
                          next(art)  
                        })                                  
                      }
                                                               
                    });      
      }

 
      //获取所有分类
       async function getCategories(callback){
        let gc = await CategoryModel.find().exec();
        callback(gc);
      }

      //获取所有作者
        async function getUsers(callback){
          let AllUsers = await UserModel.find().exec();
          callback(AllUsers);
        }
    

      module.exports={
        getCategories,
        getUsers,
        getArticles,
        getArticle,
        updateFavoraties,
        updateComments,
        //getArticlesByCategory,
        //getArticlesByUser
      } 
       
 
  

    var ArticleModel=require('./article.js');
    var CategoryModel = require('./category.js');
    var UserModel = require('./user.js');

    //定义拼接Json的方法,用于条件拼接后查询
    function joinJson(...vals){
      let result = {};
      for(let i=0;i<vals.length;i++){
        if(typeof(vals[i])=='object'){
          for(let key in vals[i]){
            result[key] = vals[i][key];
          }
        }
      }
      return result
    } 

    //定义条件查询获取文章的方法
    function getArticlesByCondition(con={},callback){
      let condition=joinJson({published:true},con)
      ArticleModel.find(condition)
                  .populate('author')
                  .populate('category')
                  .sort('created')
                  .exec((err,doc,next)=>{  
                    //注意：find方法查询到的doc为所有符合条件的document组成的"数组"
                    if(err){
                      return next(err)
                    }
                    callback(doc)
                  })  
    }

    //因为后面要用根据查询到的'文章总数'再来分页，所以上述方法暂时搁浅了

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
      ArticleModel.findOne(req.query)
                 .populate('author')
                 .populate('category')
                 .exec(function(err,doc){
                    if(err){
                      return next(err)
                    }
                    next(doc)                                           
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


    //通过分类找到文章
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
                            callback(arts,pageNum,pageCount,name) 
                          });              
      })

    }

    //通过作者找到文章
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
                            callback(arts,pageNum,pageCount,name) 
                          });              
      })

    }
  

    module.exports={
      getCategories,
      getUsers,
      getArticles,
      getArticle,
      updateFavoraties,
      updateComments,
      getArticlesByCategory,
      getArticlesByAuthor
    } 
     


    // articles API
    const mongoose = require('./db.js'),
        catesApi = require('./categories'),
        authorsApi = require('./authors'),
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    let ArticleSchema = new mongoose.Schema({
    	title:{type: String, required: true},
    	content:{type: String, required: true},
    	slug:{type: String, required: true},
    	category:{type: Schema.Types.ObjectId, ref: 'Category'},
    	author:{type: Schema.Types.ObjectId, ref: 'User'},
    	published:{ type:Boolean, default: false },
    	meta:{ type:Schema.Types.Mixed },
    	comments:[ Schema.Types.Mixed ],  //注意：此处不能加type：
    	created:{ type:Date }
    });

    let ArticleModel=mongoose.model('Article', ArticleSchema);
    const CategoryModel = catesApi.CategoryModel;
    const AuthorModel = authorsApi.AuthorModel;

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

    //获取文章
    function getArticles(condition={}){
    	return ArticleModel.find(condition)
                      .populate('author')
                      .populate('category')
                      .sort({'created':-1})
                      .exec()
    }

    //定义根据分类获取发布的文章的方法
    function  getArticlesByCategoryForPublished(condition={}){
      let cate=CategoryModel.findOne(condition).exec()
      return cate.then(category=>{
        return ArticleModel.find(joinJson({category:category},{published:true}))
                            .populate('author')
                            .populate('category')
                            .sort({'created':-1})
                            .exec()

      })   
    }

    //定义根据分类获取发布或未发布的文章的方法
    function  getArticlesByCategory(condition={}){
      let cate=CategoryModel.findOne(condition).exec()
      return cate.then(category=>{
        return ArticleModel.find({category:category})
                            .populate('author')
                            .populate('category')
                            .sort({'created':-1})
                            .exec()

      })   
    }   

    //定义根据作者获取已发布的文章的方法
    function  getArticlesByAuthorForPublished(condition={}){
      let cate=AuthorModel.findOne(condition).exec()
      return cate.then(author=>{
        return ArticleModel.find(joinJson({author:author},{published:true}))
                            .populate('author')
                            .populate('category')
                            .sort({'created':-1})
                            .exec()

      })   
    }

    //定义根据作者获取已发布或未发布的文章方法
    function  getArticlesByAuthor(condition={}){
      let cate=AuthorModel.findOne(condition).exec()
      return cate.then(author=>{
        return ArticleModel.find({author:author})
                            .populate('author')
                            .populate('category')
                            .sort({'created':-1})
                            .exec()

      })   
    }

    //文章排序
    function sortArticles(condition={}){
      if(condition.favoraites){
        let newCon = {}
        newCon['meta.favoraites']=condition.favoraites
        return ArticleModel.find()
                         .populate('category')
                         .populate('author')
                         .sort(newCon)
                         .exec()
      }
      return ArticleModel.find()
                         .populate('category')
                         .populate('author')
                         .sort(condition)
                         .exec()
    }

    //根据分类和作者双条件做筛选
    function getArticlesByBoth(condition={},callback){
      CategoryModel.findOne({_id:condition['category._id']}).exec(function(error,category){
        AuthorModel.findOne({_id:condition['author._id']}).exec(function(err,author){
          ArticleModel.find({category:category,author:author})
                      .populate('category')
                      .populate('author')
                      .exec(function(erroror,arts){
            callback(arts)            
          })
        })
      })
    }
    //添加文章
    function addArticle(data={}){
        return new ArticleModel(data).save()
    }

    //删除文章
    function deleteArticle(condition={}){
        return ArticleModel.deleteOne(condition).exec()
    }

    //修改文章
    function updateArticle(condition={},newData={},callback){
        console.log(newData.comment)
        ArticleModel.findOne(condition).exec((err,doc)=>{
          if(typeof(newData.comment)=='object'){
            for(let i=0;i<newData.comment.length;i++){
              doc.comments[i]['content']=newData.comment[i];
            }
          }else if(Boolean(newData.comment)!=false){
            doc['comments'][0]['content']=newData.comment
          }

          doc.title=newData.title;
          doc.category=newData.category;
          doc.author=newData.author;
          doc.content=newData.content;
          doc.meta.favoraties=newData['meta.favoraties'];
          doc.published=newData.published;
          doc.markModified('comments');
          doc.markModified('meta');
          doc.save(function(err,doc){
            callback('ok');           
          });

        });
      
      return ArticleModel.updateOne(condition,newData)
    }

    //处理详情页点赞功能
    function updateFavoraties(condition={}){
      console.log(condition)
      let art = ArticleModel.findOne({_id:condition._id}).exec()
      return art.then(doc=>{
        if(condition.favorate){
          doc.meta.favoraties++;
          doc.markModified('meta');  //后面如果是在save函数回调方法中渲染页面则不需要加此句，否则必须加上这句才能保存修改数据。
          doc.save()
          return new Promise((resolve,reject)=>{
            resolve([doc])  //包装成数组是为了统一路由里的渲染方法里的aticles
          })
        }
      })
    }    
  
    //添加评论
    function updateComments(condition={}){
      console.log(condition)
      let art = ArticleModel.findOne({_id:condition._id}).exec()
      return art.then(doc=>{
        if(condition.content){
          let comment ={
            uid:condition.content.user_id,
            content:condition.content.content,
            created:new Date()
          }
          doc.comments.unshift(comment); 
          doc.markModified('comments');
          doc.save()
          return new Promise((resolve,reject)=>{
            resolve([doc])  //包装成数组是为了统一路由里的渲染方法里的aticles
          })
        }
      })
    }


    module.exports={
      ArticleModel,
      getArticles,
      getArticlesByCategory,
      getArticlesByAuthor,
      getArticlesByCategoryForPublished,
      getArticlesByAuthorForPublished,
      getArticlesByBoth,
      addArticle,
      deleteArticle,
      updateArticle,
      updateFavoraties,
      updateComments,
      sortArticles,
    }
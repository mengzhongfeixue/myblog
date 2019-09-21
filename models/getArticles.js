
const ArticleModel=require('./article.js');
const CategoryModel = require('./category.js');
const UserModel = require('./user.js');

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
    function getArticlesBy(condition={}){
      return ArticleModel.find(condition)
                  .populate('author')
                  .populate('category')
                  .sort('created')
                  .exec() 
    }    

    //定义获取所有发布的文章的方法
    function getArticles(condition={}){
      return getArticlesBy(joinJson({published:true},condition))
    }
    //定义根据分类获取文章的方法
    function  getArticlesByCategory(condition={}){
      let cate=CategoryModel.findOne(condition).exec()
      return cate.then(category=>{
        return ArticleModel.find({category:category,published:true})
                            .populate('author')
                            .populate('category')
                            .sort('created')
                            .exec()

      })   
    }

    //定义根据作者获取文章的方法
    function  getArticlesByAuthor(condition={}){
      let cate=UserModel.findOne(condition).exec()
      return cate.then(author=>{
        return ArticleModel.find({author:author,published:true})
                            .populate('author')
                            .populate('category')
                            .sort('created')
                            .exec()

      })   
    }


    //处理详情页点赞功能
    function updateFavoraties(condition={}){
      let art = ArticleModel.findOne({_id:condition._id}).exec()
      return art.then(doc=>{
        if(condition.favorate!={}){
          doc.meta.favoraites++;
          doc.markModified('meta');  //后面如果是在save函数回调方法中渲染页面则不需要加此句，否则必须加上这句才能保存修改数据。
          doc.save()
          return new Promise((resolve,reject)=>{
            resolve([doc])  //包装成数组是为了统一路由里的渲染方法里的aticles
          })
        }
      })

      // let result= art.then(doc=>{
      //   if(condition.favorate!={}){
      //     doc.meta.favoraites++;
      //     return doc.save()           
      //   }
      // })
      // return result.then(isOk=>{
      //   if(isOk.OK!=0) resolve('点赞成功')
      //   if(isOk.OK==0) reject('点赞失败')        
      // })
    }    
  

    //添加评论
    function updateComments(condition={}){
      let art = ArticleModel.findOne({_id:condition._id}).exec()
      return art.then(doc=>{
        if(condition.content){
          let comment ={
            uid:condition.user_id,
            content:condition.content,
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

    //获取所有分类
    function getCategories(){
      return CategoryModel.find().exec()
    }

    //获取所有作者
    function getAuthors(){
      return UserModel.find().exec()
    }    

    module.exports={
      getArticles,
      getArticlesByCategory,
      getArticlesByAuthor,
      getCategories,
      getAuthors,
      updateFavoraties,
      updateComments
    }
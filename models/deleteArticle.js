
    const ArticleModel=require('./article.js');
    const ga = require('./getArticles');

    //删除文章
    function deleteArticle(req,res,callback){
      ArticleModel.deleteOne(req.query,(err,doc,next)=>{
        if(err){
          next(err)
        }else{
          ga.getArticles(req,res,callback)      
        }

      })    
    }

    module.exports=deleteArticle
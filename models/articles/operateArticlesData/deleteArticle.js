
const ArticleModel=require('../articlesModel/article')

    function deleteArticle(condition={}){
      return ArticleModel.deleteOne(condition).exec()
    }

module.exports={
  deleteArticle,
  //deleteCategory,
  //deleteAuthor
}





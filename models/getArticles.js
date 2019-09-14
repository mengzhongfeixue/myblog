 
    //Article 中添加数据
    var ArticleModel=require('./article.js');
    var CategoryModel = require('./category.js');
    var UserModel = require('./user.js');
    // var cg=new ArticleModel({
    //     title:'First blogger about Vue',
    //     slug:'first-blogger-about-vue',
    //     content:' Vue blogger content',
    //     category: "5d7b4a29994cdd1bb8896dd2",  
    //     author: '5d7a51b7e0fbee0ff0ee70c9',
    //     published: true,
    //     meta:{ favourates:0},
    //     comments:[],
    //     created: new Date()
    // });
    // cg.save(function(err,docs){
    //     if(err){
    //         console.log(err);
    //         return;
    //     }
    //        //console.log(docs);
    //     ArticleModel.find({},function(err,docs){
    //         if(err){
    //             console.log(err);
    //             return;
    //         }
    //         console.log(docs);
    //         return;
    //     })
    // }); 

        //多表关联查询
    function getArticles(callback){
            ArticleModel.find()
                     .populate('author')
                     .populate('category')
                     .exec(function(err,docs){
                          if(err){
                              console.log(err);
                              return;
                          }
                          callback(docs);              
                      });
        }    
        
 
    module.exports=getArticles;
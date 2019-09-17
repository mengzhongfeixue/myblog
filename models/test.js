    var ArticleModel=require('./article.js');
    var CategoryModel = require('./category.js');
    var UserModel = require('./user.js');

    //定义Json拼接方法
     function joinJson(...vals){
            let result = {};
            for(let i=0;i<vals.length;i++){
              if(typeof(vals[i])=='object'){
                for(let key in vals[i]){
                  result[key] = vals[i][key];
                }
              }
            }
            return result; 
          } 


   
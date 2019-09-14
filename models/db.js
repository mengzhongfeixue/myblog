    //连接数据库
	var mongoose=require('mongoose');

	//useNewUrlParser这个属性会在url里识别验证用户所需的db,未升级前是不需要指定的,升级到要指定，否则报警。
	mongoose.connect('mongodb+srv://mengfei:******@cluster0-qbhiu.mongodb.net/blog?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology:true },function(err){
	        if(err){
	            console.log(err);
	            return;
	        }
	        console.log('数据库连接成功')
	});

	module.exports=mongoose;
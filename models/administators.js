	//Admin API
	var mongoose = require('./db.js');
    var md5= require('md5');
	var AdminSchema = new mongoose.Schema({
		name:{type: String, required: true,unique:true},
		telephone:{type:String,required:true},
		email:{type: String, required: true,unique:true},
		password:{type: String, required: true},
		created:{type: Date}
	});

	let AdminModel=mongoose.model('Admin',AdminSchema);
	//增加管理员
	function addAdmin(doc={}){
		if(doc.password){
			doc.password=md5(doc.password);
		}
		return new AdminModel(doc).save()
	}
	//获取管理员
	function getAdmins(condition={}){
		return AdminModel.find(condition).sort({'created':'asc'}).exec()
	}
	//删除管理员
	function deleteAdmin(condition={}){
		return AdminModel.deleteOne(condition).exec()
	}
	//修改管理员
	function updateAdmin(condition={},data={}){
		return AdminModel.updateOne(condition,data).exec()
	}
    //管理员排序
	function sortAdmins(condition){
		return AdminModel.find().sort(condition).exec() 
	}

	module.exports={
		AdminModel,
		addAdmin,
		deleteAdmin,
		updateAdmin,
		getAdmins,
		sortAdmins
	}

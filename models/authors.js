	//author API
	var mongoose = require('./db.js');

	var AuthorSchema = new mongoose.Schema({
		name:{type: String, required: true},
		email:{type: String, required: true},
		password:{type: String, required: true},
		created:{type: Date}
	});

	let AuthorModel=mongoose.model('User',AuthorSchema,'authors');
	//增加作者
	function addAuthor(doc={}){
		return new AuthorModel(doc).save()
	}
	//获取作者
	function getAuthors(condition={}){
		return AuthorModel.find(condition).sort({'created':'asc'}).exec()
	}
	//删除作者
	function deleteAuthor(condition={}){
		return AuthorModel.deleteOne(condition).exec()
	}
	//修改作者
	function updateAuthor(condition={},data={}){
		return AuthorModel.updateOne(condition,data).exec()
	}
    //作者排序
	function sortAuthors(condition){
		console.log(condition)
		return AuthorModel.find().sort(condition).exec() 
	}

	module.exports={
		AuthorModel,
		addAuthor,
		deleteAuthor,
		updateAuthor,
		getAuthors,
		sortAuthors
	}

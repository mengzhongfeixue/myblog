	//Categories API
	var mongoose = require('./db.js');
    const slug = require('slug');
    const pinyin = require('pinyin');
	var CategorySchema = new mongoose.Schema({
		name:{type: String, required: true,unique:true},
		slug:{type: String, required: true},
		created:{type: Date}
	});

	let CategoryModel=mongoose.model('Category',CategorySchema,'categories');
	const artsApi = require('./articles');
    const ArticleModel = artsApi.ArticleModel;	
	//增加分类
	function addCategory(doc={}){
        let title =pinyin(doc.name,{
        	style:pinyin.STYLE_NORMAL,
        	heteronym:false
        }).map(function(item){
        	return item[0];
        }).join(' ');
        let name_slug = slug(title);
        let cate = {};
        cate['name']=doc.name;
        cate['slug']=name_slug;
        cate['created']=new Date();
		return new CategoryModel(cate).save();
	}
	//获取分类
	function getCategories(condition={}){
		return CategoryModel.find(condition).sort({'created':-1}).exec()
	}
	//删除分类 
	function deleteCategory(condition={}){
		return CategoryModel.deleteOne(condition).exec();
	}
	//修改分类
	function updateCategory(condition={},data={}){
		let title =pinyin(data.name,{
        	style:pinyin.STYLE_NORMAL,
        	heteronym:false
        }).map(function(item){
        	return item[0];
        }).join(' ');
        let name_slug = slug(title);
        let cate = {};
        cate['name']=data.name;
        cate['slug']=name_slug;
        cate['created']=new Date();
		return CategoryModel.updateOne(condition,cate).exec()
	}

    //分类排序
	function sortCategories(condition){
		return CategoryModel.find().sort(condition).exec() 
	}

	module.exports={
		CategoryModel,
		addCategory,
		deleteCategory,
		updateCategory,
		getCategories,
		sortCategories
	}

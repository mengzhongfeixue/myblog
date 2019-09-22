// category model
var mongoose = require('../../connectDatabase/db.js');

var CategorySchema = new mongoose.Schema({
	name:{type: String, required: true},
	slug:{type: String, required: true},
	created:{type: Date}
});

module.exports=mongoose.model('Category', CategorySchema,'categories');
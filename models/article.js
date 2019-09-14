// article model
var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var ArticleSchema = new mongoose.Schema({
	title:{type: String, required: true},
	content:{type: String, required: true},
	slug:{type: String, required: true},
	category:{type: Schema.Types.ObjectId, ref: 'Category'},
	author:{type: Schema.Types.ObjectId, ref: 'User'},
	published:{ type:Boolean, default: false },
	meta:{ type:Schema.Types.Mixed },
	comments:[ Schema.Types.Mixed ],  //注意：此处不能加type：
	created:{ type:Date }
});

module.exports=mongoose.model('Article', ArticleSchema);
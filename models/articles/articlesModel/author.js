//user model
var mongoose = require('../../connectDatabase/db.js');

var AuthorSchema = new mongoose.Schema({
	name:{type: String, required: true},
	email:{type: String, required: true},
	password:{type: String, required: true},
	created:{type: Date}
});

module.exports=mongoose.model('User',AuthorSchema);
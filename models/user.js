//user model
var mongoose = require('./db.js');

var UserSchema = new mongoose.Schema({
	name:{type: String, required: true},
	email:{type: String, required: true},
	password:{type: String, required: true},
	created:{type: Date}
});

module.exports=mongoose.model('User',UserSchema);
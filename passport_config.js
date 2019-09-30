var passport = require('passport');
var LocalStragegy = require('passport-local').Strategy;
var authorsApi = require('./models/authors');
module.exports.init=function(){
	passport.use(new LocalStragegy({
		usernameField:'email',
		passwordField:'password'
	  },function(email,password,done){
        authorsApi.AuthorModel.findOne({email:email},function(err,user){
            console.log('passport.local.find',user,err);
        	if(err){
        		return done(err);
        	}
        	if(!user){
        		return done(null,false);
        	}
        	if(!user.verifyPassword(password)){
        		return done(null,false);

        	}
        	return done(null,user);
        })
	}));
	passport.serializeUser(function(user, done) {
	  //console.log('passport.local.serializeUser',user);
	  done(null, user._id);
	});
	 
	passport.deserializeUser(function(id, done) {
		//console.log('passport.local.deserializeUser',id);
	  authorsApi.AuthorModel.findById(id, function (err, user) {
	    done(err, user);
	  });
	});
}
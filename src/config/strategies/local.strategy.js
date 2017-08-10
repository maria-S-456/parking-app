var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');

function isValidPassword(user, password){
	return bcrypt.compareSync(password, user.password)
}

module.exports = function(){
	passport.use(new LocalStrategy({
		username: 'username',
		password: 'password'
	},
	function(username, password, done){
	var url = 'mongodb://maria:hold7b7@ds135983.mlab.com:35983/parkingusers';
	mongodb.connect(url, function(err, db){
		var collection = db.collection('users');
		collection.findOne({
			username: username
		},
		function(err, user){
			if(isValidPassword(user, password)){
		
			done(null, user);
			} else{
				done(null, false,{
					message: 'bad password'
				});
				console.log('bad password');
			}
		}
		);
	});

	}));
};
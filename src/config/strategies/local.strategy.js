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
	var url = 'mongodb://localhost:27017/parkingUsers';
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
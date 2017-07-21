var express = require('express');
var authRoute = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var {parkingHouse} = require('../../models');
	
	authRoute.route('/usersignup').post(function(req,res){
		//console.log(req.body);
		console.log('new user created: ' + req.body);
		var url = 'mongodb://localhost:27017/parkingUsers';
		mongodb.connect(url, function(err,db){
			var collection = db.collection('users');
			var users = {
				username: req.body.username,
				password: req.body.password
			};

		collection.insert(users, function(err, results){
			req.login(results.ops[0], function(){
				res.redirect('/auth/profile');
			});
		});
		});
	});

	authRoute.route('/userlogin').post(passport.authenticate('local', { 
		failureRedirect: '/'
	}), function(req, res){
		console.log(req.user); //'user' is not the name of the collection containing the user info, but the user credentials of the current session
		res.redirect('/auth/profile');
	});	

	//profile route requires authentication
	authRoute.route('/profile').all(function(req,res, next){
		if(!req.user){
			res.redirect('/login');
		}
		next();
	}).get(function(req,res){

		console.log("This is my profile.");
		res.json(req.user);
	});

	authRoute.get('/locate', (req,res)=>{
		
		parkingHouse.find().exec().then(locations => {
			console.log('Parking house search page');
			res.render('locate', {data: locations});
		});
		
	});

	authRoute.get('/api', (req,res)=>{
		parkingHouse.find().exec().then(locations => {
			res.json({
				locations:locations.map((location) => location.apiRepr())
			});
		})
		.catch(
			err =>{
				console.log(err);
				res.status(500).json({message: 'Internal server error'});
			});
	})

module.exports = authRoute;
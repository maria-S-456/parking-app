var express = require('express');
var authRoute = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var {parkingHouse} = require('../../models');
	
	authRoute.route('/usersignup').post(function(req,res){
		
		var url = 'mongodb://localhost:27017/parkingUsers';
		var newUser = {
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
		}
		bcrypt.genSalt(10, function(err, salt){
			if(err){
				console.log('Error: ' + err);
			}
			bcrypt.hash(newUser.password, salt, function(err, hash){
				if(err){
					console.log('Error: ' + err);
				}
				var secureUser = {
					username: req.body.username,
					password: hash,
					email: req.body.email
				}
				mongodb.connect(url, function(err,db){
					var collection = db.collection('users');

					collection.insert(secureUser, function(err, results){
						req.login(results.ops[0], function(){
							res.redirect('/auth/profile');
						})
					})
				});

			})
			
		})
		
	});

	authRoute.route('/userlogin').post(passport.authenticate('local', { 
		failureRedirect: '/login'
	}), function(req, res){
		res.redirect('/auth/profile');
	});

	authRoute.get('/logout', (req, res)=>{
		if(!req.user){
			res.redirect('/');
		}
		else{
			req.logout();
			res.redirect('/');
			console.log('you have been logged out.');
		}
	})

	authRoute.route('/profile').all(function(req,res, next){
		//console.log(req.user);
		if(!req.user){
			res.redirect('/login');
			console.log('You are unauthorized to enter the profile page');
			
		}
		else(res.render('profile', {data: [req.user.username, req.user.email]}));
	});

	authRoute.get('/locate', (req,res)=>{
		if(!req.user){
			res.redirect('/login');
			console.log('You are unauthorized to enter the locating page');
		}
		else{
			parkingHouse.find().exec().then(locations => {
			//console.log('Parking house search page');
				res.render('locate', {data: locations});
			});		
		}
	});

	authRoute.get('/api', (req,res)=>{
		if(!req.user){
			res.redirect('/login');
			console.log('Unauthorized api access');
		}
		else{

			parkingHouse.find().exec().then(locations => {
				res.json({
					locations:locations.map((location) => location.apiRepr())
				});
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({message: 'Internal server error'});
			});
		};
		
	});

module.exports = authRoute;
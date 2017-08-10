var express = require('express');
var authRoute = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var {parkingHouse, userData, mailerUser} = require('../../models');

	authRoute.get('/usersapi', (req,res)=>{
		if(req.user.username != 'maria'){
			res.redirect('/auth/profile');
			console.log('You do not have permission to access this page.');
		}
		else{
			userData.find().exec().then(users => {
				res.json({
					users:users.map((user) => user.apiRepr())
				});
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({message: 'Internal server error'});
			});
		};
	});
	
	authRoute.route('/usersignup').post(function(req,res){
		var url = 'mongodb://maria:hold7b7@ds135983.mlab.com:35983/parkingusers';
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

	authRoute.route('/userlogin').post(passport.authenticate('local',  { 
		failureRedirect: '/login'
	}), function(req, res){
		res.redirect('/auth/profile');
	});

	authRoute.get('/logout', (req, res)=>{
		if(!req.user){
			res.redirect('/');
			console.log('You have to be logged in to log out!')
		}
		else{
			req.logout();
			res.redirect('/');
			console.log('you have been logged out.');
		}
	})

	authRoute.route('/profile').all(function(req,res, next){
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
				res.render('locate', {data: locations});
				//console.log(locations);
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
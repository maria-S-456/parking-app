var express = require('express');
//define homeRoute route handler
var homeRoute = express.Router();
var mongodb = require('mongodb').MongoClient;
var authconfig = require('../config/authconfig.js');
var nodemailer = require('nodemailer');

	var smtpTransport = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	auth:{
		user : authconfig.mailer.auth.user,
		pass : authconfig.mailer.auth.pass
	}
});	
	homeRoute.route('/contact').post(function(req, res){
		//console.log(req.body.name);
		var mailOptions = {
			subject: req.body.name, //name
			to: req.body.email, //email
			text: req.body.message //message
		};
		
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				console.log(error);
				res.end("error");
			}else{
				console.log("Message sent");
				res.redirect('/');
				res.end("sent");
			}
		});

	});
	

	homeRoute.route('/suggest').post(function(req,res){
		//console.log(req.body.name);
		var url = 'mongodb://localhost:27017/parkingUsers';
		mongodb.connect(url, function(err,db){
			var collection = db.collection('suggestions');
			var suggestions = {
				location: req.body.location,
				name: req.body.name,
				email: req.body.email
			};
		collection.insert(suggestions, function(err, results){
			
			if(err){
				console.log('Error sending suggestion message.');
			}
			//console.log(results.ops[0]);
			req.login(results.ops[0], function(){
				console.log("Successfully sent!")
				res.redirect('/');
			});
			
			});
		});
	});
	/*
	var nodemailer = require('nodemailer');
var authconfig = require('./src/config/authconfig.js');
var smtpTransport = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	auth:{
		user: authconfig.mailer.auth.user,
		pass: authconfig.mailer.auth.pass
	}
});

homeRoute.route('/contact', function(req, res){
	smtpTransport.sendMail(mail)
})
*/
module.exports = homeRoute;
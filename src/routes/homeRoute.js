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
		
		var mailOptions = {
			subject: req.body.contactname,
			to: req.body.contactemail, 
			text: req.body.contactmessage 
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
		
		var url = 'mongodb://localhost:27017/spotfindersuggestions';
		mongodb.connect(url, function(err,db){
			var collection = db.collection('suggestions');
			console.log('inserting suggestions');
			var suggestions = {
				suggestemail: req.body.suggestemail,
				suggestname: req.body.suggestname,
				suggestmessage: req.body.suggestmessage
			};
			
			collection.insert(suggestions, function(err, results){
			
				if(err){
					console.log('Error sending suggestion message.');
				}
				else{
					console.log("Successfully sent!");
					res.redirect('/');
				}
			
			});
		});
	});
	
module.exports = homeRoute;
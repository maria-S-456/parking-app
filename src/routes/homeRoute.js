var express = require('express');

//define homeRoute route handler
var homeRoute = express.Router();
var mongodb = require('mongodb').MongoClient;
var authconfig = require('../config/authconfig.js');
var nodemailer = require('nodemailer');
var {mailerUser} = require('../../models');	
		
/*
	function myfunction(){
	var url = 'mongourl'
	mongodb.connect(url, function(err,db){
		let collection = db.collection('credentials');
		collection.findOne({
			email:"myemail@gmail.com"
		},
		function(err,user){
			var myuser = {"email":user.email, "password":user.password};
			return myuser;
		});

	})
	//this is were myuser needs to be returned
}
*/
	function mailerconnect(){
		let url = 'mongodb://maria:6fen$g*g@ds151431.mlab.com:51431/parkingowner';

		mongodb.connect(url, function(err, db){

			var query = {email: "bluegriffin633@gmail.com"};
			var cursor = db.collection('credentials').find(query);

			cursor.each(function(err,doc) {
				if(doc == null){
					return db.close();
				}
				console.dir('email ' + doc.email);
			});
			
			//console.dir(doc.email);
			
		})
		var hello = 'hi';
		return hello;
	};

	homeRoute.route('/contact').post(function(req, res){
		console.log(mailerconnect());

		var smtpTransport = nodemailer.createTransport({
			service: "gmail",
			host: "smtp.gmail.com",
			auth:{
				user : authconfig.mailer.auth.user,
				pass : authconfig.mailer.auth.pass
			}
		});

		var mailOptions = {
			to: authconfig.mailer.auth.user,
			subject: req.body.contactname + ' <' + req.body.contactemail + '>',			 
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
		let url = 'mongodb://maria:72besF@ds015508.mlab.com:15508/parkingsuggestions';
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
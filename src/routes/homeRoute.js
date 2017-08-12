var express = require('express');

//define homeRoute route handler
var homeRoute = express.Router();
var mongodb = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
//var {mailerUser} = require('../../models');	
		
	homeRoute.route('/contact').post(function(req, res){
		let url = 'mongodb://maria:6fen7grg@ds151431.mlab.com:51431/parkingowner';

		//var blue = process.env.PARKINGDB_OWNER;
		//console.log('blue ' + blue);

		mongodb.connect(url, function(err, db){
			if(err){
				console.log('Unable to connect to Mongo.', err);
			}
			else{
				console.log('Connected.');

				var collection = db.collection('credentials');
				collection.find({}).toArray(function(err, results){
					if(err){
						res.send(err);
					}
					else{
						var smtpTransport = nodemailer.createTransport({
							service: "gmail",
							host: "smtp.gmail.com",
							auth:{
								user : results[0].email,
								pass : results[0].password
							}
						});

						var mailOptions = {
							to: results[0].email,
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
					}
					db.close();
				})
			}
			
		})
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
const bodyParser = require('body-parser');

const express = require('express');
const app = express();
var mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require('./config.js');
mongoose.Promise = global.Promise;
var db = mongoose.connect(DATABASE_URL);
var passport = require('passport');
const {BasicStrategy} = require('passport-http');

const Models = require('./models');
app.use(bodyParser.json()); //error: "TypeError: Cannot use &#39;in&#39; operator to search for &#39;location&#39; in undefined" will occur without this when posting new info

//nodemailer code
//*****************************

var nodemailer = require('nodemailer');
const config = require('./authConfig.js');

var smtpTransport = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	auth:{
		user : config.mailer.auth.user,
		pass : config.mailer.auth.pass
	}
});

//***********************

app.use(express.static('public'));
app.use(express.static('styles'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/about.html');
});

app.get('/help', (req, res) => {
  res.sendFile(__dirname + '/public/helpData.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/search', (req, res) => {
  res.sendFile(__dirname + '/public/searchData.html');
});

app.get('/api', function(req, res) {
	Models.spots.find().exec().then(spots => {
		res.json(spots.map(spot =>spot.apiRepr()));

	}).catch(err => {
		console.error(err);
		res.status(500).json({error: 'GET failed'});
	});
	
});


app.get('/user', function(req, res) {
	Models.users.find().exec().then(users => {
		res.json(users.map(user =>user.apiRepr()));
	}).catch(err => {
		console.error(err);
		res.status(500).json({error: 'GET failed'});
	});
});


app.get('/api/:location', function(req, res) {
	Models.spots.find({location:req.params.location}).exec().then(spots => {
		res.json(spots.map(spot =>spot.apiRepr()));
	}).catch(err => {
		console.error(err);
		res.status(500).json({error: 'GET failed'});
	});
});
//nodemailer code
//***********************

app.get('/send', function(req,res){
	var mailOptions = {
		subject: req.query.subject, //name
		to: req.query.to,		//email
		text: req.query.text		//message
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error,response){
		if(error){
			console.log(error);
			res.end("error");
		}else{
			console.log("Message sent: " + response.message);
			res.end("sent");
		}
	});

});

//***************************
//error: "TypeError: Cannot use &#39;in&#39; operator to search for &#39;location&#39; in undefined"
app.post('/api', function(req, res){
	const requiredFields = ['location', 'vacant','capacity'];
	for(var i=0; i< requiredFields.length; i++){
		const field = requiredFields[i];
		//console.log(req.body.location);
		//console.log(req.body.vacant);
		//console.log(req.body.capacity);
		if(!(field in req.body)) {
			const message = `missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Models.spots.create({
		location: req.body.location,
		vacant: req.body.vacant,
		capacity: req.body.capacity
	})
	.then(spot => res.status(201).json(spot.apiRepr())).catch(err => { console.error(err);
		res.status(500).json({error: 'Failed adding new data'});
		});
});

//*****CREATING A USER****************



const basicStrategy = new BasicStrategy((username, password, callback) => {
	console.log('in basic strategy');
  let user;
  Models.users
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});

      }
      else {
        return callback(null, user)
      }
    });

});

//this block must come after basicStrategy is made to work
passport.use(basicStrategy);
app.use(passport.initialize());

app.post('/user', function(req, res){
	
	const reqFields = ['firstName', 'lastName', 'username', 'email', 'password'];
	for(var i=0; i < reqFields.length; i++){
		let field = reqFields[i];

		if(!(field in req.body)) {
			let message = `missing \'${field}\' in request body`;
			console.log(message);
			return res.status(400).send(message);
		}
		
	}
	Models.users.create({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	})
	.then(user => res.status(201).json(user.apiRepr())).catch(err => { console.error(err);
		res.status(500).json({error: 'Failed adding new user'});
		});
});

app.get('/user/me',
  passport.authenticate('basic', {session: false}),
  (req, res) => res.json({user: req.user.apiRepr()})
);


//************************************

app.listen(process.env.PORT || 8000, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8000}`);
});

exports.app = app; //export app so mocha can test it
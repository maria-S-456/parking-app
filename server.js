const bodyParser = require('body-parser');
const express = require('express');
const app = express();
var mongoose = require('mongoose');

const {DATABASE_URL} = require('./config.js');

mongoose.Promise = global.Promise;
var db = mongoose.connect(DATABASE_URL);
const parkingcollection = require('./models'); //"parking collection is not defined" error will occur without this.
app.use(bodyParser.json()); //error: "TypeError: Cannot use &#39;in&#39; operator to search for &#39;location&#39; in undefined" will occur without this when posting new info

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
	parkingcollection.find().exec().then(spots => {
		res.json(spots.map(spot =>spot.apiRepr()));
	}).catch(err => {
		console.error(err);
		res.status(500).json({error: 'GET failed'});
	});
});

app.get('/api/:location', function(req, res) {
	parkingcollection.find({location:req.params.location}).exec().then(spots => {
		res.json(spots.map(spot =>spot.apiRepr()));
	}).catch(err => {
		console.error(err);
		res.status(500).json({error: 'GET failed'});
	});
});

//error: "TypeError: Cannot use &#39;in&#39; operator to search for &#39;location&#39; in undefined"
app.post('/api', function(req, res){
	const requiredFields = ['location', 'vacant','capacity'];
	for(var i=0; i< requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	parkingcollection.create({
		location: req.body.location,
		vacant: req.body.vacant,
		capacity: req.body.capacity
	})
	.then(spot => res.status(201).json(spot.apiRepr())).catch(err => { console.error(err);
		res.status(500).json({error: 'Failed adding new data'});
		});
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8000}`);
});

exports.app = app; //export app so mocha can test it
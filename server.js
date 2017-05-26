var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session'); //importing the client-sessions library

var headers = [
		{
			fname: 'Harold',
			lname: 'Finch'
		},
		{
			fname: 'John',
			lname: 'Reese'
		}
]

var port = process.env.PORT || 3000;

//define routes
var authRoute = require('./src/routes/authRoute');
var homeRoute = require('./src/routes/homeRoute');

//this is to serve static files such as css in the /public directory
//when navigating to the css file in the ejs file, /public will be the default parent directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('a'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

require('./src/config/passport')(app);

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/src/views'));

app.use('/auth', authRoute);
app.use('/', homeRoute);

app.get('/', function(req, res){
	res.render('home');
});

app.get('/login', function(req,res){
	res.render('login');
});

app.get('/sample', function(req,res){
	res.render('sample', {about: 'About', cities: 'Currently Featured Cities', signup: 'Sign Up', suggestions: 'Suggestions', contact: 'Contact'
	});
})

app.listen(port, function(err){
	console.log('running on port ' + port);
});
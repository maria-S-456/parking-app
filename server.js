var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT,DATABASE_URL} = require('./apiconfig');
var {parkingHouse, userData} = require('./models');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session'); //importing the client-sessions library

//define routes
var authRoute = require('./src/routes/authRoute');
var homeRoute = require('./src/routes/homeRoute');

//this is to serve static files such as css in the /public directory
//when navigating to the css file in the ejs file, /public will be the default parent directory
app.use(express.static('public'));
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
  if(req.user !== undefined){
    res.redirect('/');
    console.log('Please log out before logging back in!');
  }
  else{
	  res.render('login');
  }
});

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = app;
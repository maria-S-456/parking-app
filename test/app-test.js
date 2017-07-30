var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);


describe('login page', function() {
  it('should exist', function(done) {
    chai.request(app)
      .get('/login')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});

describe('home', function(){
	it('should exist', function(done){
		chai.request(app).get('/').end(function(err,res){
			res.should.have.status(200);
			res.should.be.html;
			done();
		});
	});
});

describe('locate', function(){
	it('should exist', function(done){
		chai.request(app).get('/auth/locate').end(function(err,res){
			res.should.have.status(200);
			res.should.be.html;
			done();
		});
	});
});

describe('profile', function(){
	it('should exist', function(done){
		chai.request(app).get('/auth/profile').end(function(err,res){
			res.should.have.status(200);
			res.should.be.html;
			done();
		});
	});
});
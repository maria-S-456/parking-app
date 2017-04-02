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

describe('help page', function(){
	it('should exist', function(done){
		chai.request(app).get('/help').end(function(err,res){
			res.should.have.status(200);
			res.should.be.html;
			done();
		});
	});
});

describe('search page', function(){
	it('should exist', function(done){
		chai.request(app).get('/search').end(function(err,res){
			res.should.have.status(200);
			res.should.be.html;
			done();
		});
	});
});
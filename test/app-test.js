var request = require('supertest');
 
var app = require('../server');
var auth = require('../src/routes/authRoute');
 
describe('Home Page', function() {
  it("should render successfully", function(done) {
    request(app).get('/').expect(200, done);    
  })
});

describe('Login Page', function() {
  it("should render successfully", function(done) {
    request(app).get('/login').expect(200, done);    
  })
});
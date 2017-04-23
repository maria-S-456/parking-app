var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;

Schema = mongoose.Schema;

/*
var parkingSchema = new Schema({
  location:{type:String, required: true},
  vacant:{type:Number, required: true},
  capacity:{type:Number, required: true}
});

parkingSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    location: this.location,
    vacant: this.vacant,
    capacity: this.capacity
  };
}

*/
var suggestionSchema = new Schema({
	location:{type: String, required: true},
	name:{type: String, required: true},
	email: {type: String, required: true}
});

suggestionSchema.methods.apiRepr = function(){
	return {
		id: this._id,
		location: this.location,
		name: this.name,
		email: this.email
	};
};

var userSchema = new Schema({
	firstName: {type: String, required:true},
	lastName: {type: String, required: true},
	username: {type: String, required: true, unique: true},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

userSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
		username: this.username,
		email: this.email,
		password: this.password
	};
}

userSchema.methods.validatePassword = function(password){
	return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password){
	return bcrypt.hash(password, 10);
}

var users = mongoose.model('siteUsers', userSchema, 'userscollection');
//var spots = mongoose.model('parkAvail', parkingSchema, 'parkingcollection');
var suggestions = mongoose.model('userSuggestions', suggestionSchema, 'suggestioncollection');

module.exports = {users: users, suggestions: suggestions};
var mongoose = require('mongoose');

Schema = mongoose.Schema;

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
		username: this.userName,
		email: this.email,
		password: this.password
	};
}

var users = mongoose.model('siteUsers', userSchema, 'userscollection');
var spots = mongoose.model('parkAvail', parkingSchema, 'parkingcollection');

module.exports = {users: users, spots: spots};
//module.exports = spots;

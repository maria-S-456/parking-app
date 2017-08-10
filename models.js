var mongoose = require('mongoose');

var mailerSchema = mongoose.Schema({
	email: {type: String, required: true},
	password: {type: String, required: true}
});

var userSchema = mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: false},
	email: {type: String, required: false}
});

var parkHouseSchema = mongoose.Schema({
	location_name: {type: String, required: true},
	location_id: {type: Number, required: true},
	address: {type: String, required: true},
	city: {type:String, required: true},
	state: {type: String, required: true},
	zip: {type: String, required: true},
	lat: {type: Number, required: true},
	lng: {type: Number, required: true},
	spots: {type: Number, required: true},
	price: {type: Number, required: true},
	price_formatted: {type: String, required: true}		
});

mailerSchema.methods.apiRepr = function(){
	return {
		id: this._id,
		email: this.email,
		password: this.password
	}
}

userSchema.methods.apiRepr = function(){
	return {
		id: this._id,
		username: this.username,
		password: this.password,
		email: this.email
	}
}

parkHouseSchema.methods.apiRepr = function(){
	return {
		id: this._id,
		location_name: this.location_name,
		address: this.address,
		city: this.city,
		state: this.state,
		zip: this.zip,
		lat: this.lat,
		lng: this.lng,
		price_formatted: this.price_formatted
	};
}

const parkingHouse = mongoose.model('locations', parkHouseSchema);
const userData = mongoose.model('users', userSchema);
const mailerUser = mongoose.model('credentials', mailerSchema);

module.exports = {parkingHouse, userData, mailerUser};
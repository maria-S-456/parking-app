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

module.exports = mongoose.model('parkAvail', parkingSchema, 'parkingcollection');
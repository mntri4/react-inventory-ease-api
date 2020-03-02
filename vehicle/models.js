'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Vehicle Schema
const VehicleSchema = mongoose.Schema({ 
  year: {type: Number, default: ''},
  make: {type: String, default: ''},
  model: {type: String, default: ''},
  mileage: {type: String, default: ''},
  newVehicle: {type: Boolean, default: false},
  parkingSpace: {type: String, default: ''}    
});

VehicleSchema.methods.serialize = function() {
  return {
    id: this._id,
    year: this.year,
    make: this.make,
    model: this.model,
    mileage: this.mileage,
    newVehicle: this.newVehicle,
    parkingSpace: this.parkingSpace
  };
};

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = {Vehicle};
'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Vehicle} = require('./models');
const passport = require('passport');
const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(express.json());

//Creates a new vehicle in the database with info recieved from client
//Returns specific errors for incorrect or already existing data
router.post('/', jwtAuth, (req, res) => {
	let {year, make, model, mileage, parkingSpace, newVehicle} = req.body;
	console.log(req.body);
  
  return Vehicle.find({parkingSpace})
    .count()
    .then((count) => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Parking Space Taken',
          location: 'parkingSpace'
        });
      }
    })
    .then(() => {
        return Vehicle.create({
              year,
              make,
              model,
              mileage,
              parkingSpace,
              newVehicle
            });
      })
  	  .then(vehicle => {
        	return res.status(201).json(vehicle.serialize());
      })
      .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });     
});

// Returns all vehicles in database
router.get('/', jwtAuth, (req, res) => {
  return Vehicle.find()
    .then(vehicles => res.json(vehicles.map(vehicle => vehicle.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// Find specific vehicle by id
router.get('/:id', jwtAuth, (req, res) => {
  let id = req.params.id.trim();
  return Vehicle.findById(id)
    .then(vehicle => res.json(vehicle.serialize()))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// Delete vehicle by id
router.delete('/:id', jwtAuth, (req, res) => {
  return Vehicle.findByIdAndRemove(req.params.id)
  .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

// Update vehicle mileage and parking space
router.put('/:id', jwtAuth, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
	    const message =
	      `Request path id (${req.params.id}) and request body id ` +
	      `(${req.body.id}) must match`;
	    return res.status(400).json({ message: message });
  	}
  
  let {parkingSpace, id} = req.body;
 
  
  return Vehicle.find({parkingSpace}).then((car) => {

      if (car.length > 0) {
        let inputId = id.toString();
       
        let carId = car[0]._id.toString();
      
        if (carId !== inputId && car.length > 0) {
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'Parking Space Taken',
            location: 'parkingSpace'
          });
        }
    }
    })
    .then(() => {
  	  return Vehicle.findByIdAndUpdate(
        req.params.id, { $set: { 
        						mileage: req.body.mileage,
      						  parkingSpace: req.body.parkingSpace 
      						   }
                      });
    
  })
	.then(vehicle => res.status(200).json({
	    mileage: req.body.mileage,
	    parkingSpace: req.body.parkingSpace
	}))
	.catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
  });
});


module.exports = {router};
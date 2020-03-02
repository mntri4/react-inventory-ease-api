'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Vehicle } = require('../vehicle');
const { User } = require('../user');
const { TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/vehicles', function () {

  
  const year = 1999;
  const make = 'honda';
  const model = 'accord';
  
  
  const yearB = 2000;
  const makeB = 'nissan';
  const modelB = 'altima'; 

  before(function () {
    this.timeout(10000);
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  afterEach(function () {
    return Vehicle.remove({});
  });

  
  describe('/api/vehicles', function () {
    describe('POST', function () {

      it('Should create a new vehicle', function () {
        chai
        .request(app)
        .post('/api/vehicles')
        .send({     
            year,
            make,
            model
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
                'year',
                'make',
                'model',
                'newVehicle',
                'id',
                'parkingSpace',
                'mileage'
            );
            expect(res.body.model).to.equal(model);
            expect(res.body.year).to.equal(year);
            expect(res.body.make).to.equal(make);
            return Vehicle.findOne({
              vehicleId
            });
          })
          .then(vehicle => {
            expect(vehicle).to.not.be.null;
            expect(vehicle.model).to.equal(model);
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
    });

    describe('GET', function () {
        it('Should return an empty array initially', function () {
          chai.request(app).get('/api/vehicles').then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
        });
        it('Should return an array of vehicles', function () {
          Vehicle.create(
            {
              year,
              make,
              model
            },
            {
              year: yearB,
              make: makeB,
              model: modelB
            }
          )
            .then(() => chai.request(app).get('/api/vehicles'))
            .then(res => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.length(2);
              
              expect(res.body[0].year).to.equal(year);
              expect(res.body[0].make).to.equal(make);
              
              expect(res.body[1].year).to.equal(yearB);
              expect(res.body[1].make).to.equal(makeB);
            })
            .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
        });
      });

    describe('GET with :id', function() {
      it('Should return vehicle with id', function() {
        chai.request(app).get('api/vehicles').then(res => {
          let id = res.body[0].id;
          return chai.request(app).get(`api/vehicles/${id}`).then(res2 => {
          expect(res2).to.have.status(200);
          expect(res2.body).to.be.an('object');
          expect(res2.body[0].model).to.equal(model);
          });
        });        
      });
    });

    describe('DELETE vehicle', function() {
      it('Should delete user by id', function() {
        chai.request(app).get('api/vehicles').then(res => {
          let id = res.body[0].id;
          return chai.request(app).delete(`api/vehicles/${id}`).then(res2 => {
            expect(res2.body[0]).to.equal({});
          });
        });
      });
    });
  });
});
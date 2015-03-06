'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var auth = require('../../auth/auth.service');


var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test2@test.com',
  password: 'password'
});

describe('GET /api/availabilities/mine', function() {

  //before(function(done) {
  //  // Clear users before testing
  //  User.remove().exec().then(function() {
  //    done();
  //  });
  //});

  //beforeEach(function(done) {
  //  console.log('**** removing user');
  //  User.remove().exec().then(function() {
  //    console.log('**** user removed');
  //    done();
  //  });
  //});

  //it('should respond with JSON array', function (done) {
  //  console.log('**** creating user');
  //  user.save(function(err, user) {
  //    setTimeout(function () {
  //      console.log('**** user created', user);
  //      request(app)
  //        .get('/api/availabilities/mine')
  //        .set('Authorization', 'Bearer ' + auth.signToken(user))
  //        //.expect(200)
  //        //.expect('Content-Type', /json/)
  //        .end(function (err, res) {
  //          if (err) return done(err);
  //          res.body.should.be.instanceof(Array);
  //          done();
  //        });
  //    }, 100);
  //  });
  //});

});

//describe('GET /api/availabilities', function() {
//
//  it('should create an availability', function (done) {
//
//    authorize().then(function (authorization) {
//      request(app)
//        .post('/api/availabilities')
//        .send(availability)
//        .set('Authorization', authorization)
//    });
//
//  });
//
//  it('should create an availability', function (done) {
//
//    authorize().then(function (authorization) {
//      request(app)
//        .post('/api/availabilities')
//        .send(availability)
//        .set('Authorization', authorization)
//    });
//
//  });

  //it('should respond with JSON array', function(done) {
  //  request(app)
  //    .get('/api/availabilities')
  //    .expect(200)
  //    .expect('Content-Type', /json/)
  //    .end(function(err, res) {
  //      if (err) return done(err);
  //      res.body.should.be.instanceof(Array);
  //      done();
  //    });
  //});
//});

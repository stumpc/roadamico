'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var auth = require('../../auth/auth.service');
var User = require('../user/user.model');

describe('The Place API', function () {

  var admin = new User({
    email: 'testadmin@foo.com',
    name: 'Test Admin',
    password: 'foo',
    role: 'admin'
  });

  before(function (done) {
    admin.save(function () {
      done();
    });
  });

  after(function (done) {
    User.find({}).remove(function () {
      done();
    });
  });


  describe('GET /api/places', function () {

    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/places')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });



});

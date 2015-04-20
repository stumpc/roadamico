'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var auth = require('../../auth/auth.service');
var User = require('../user/user.model');
var Place = require('./place.model');

describe('The Place API', function () {

  var admin = {
    email: 'testadmin@foo.com',
    name: 'Test Admin',
    password: 'foo',
    role: 'admin'
  };
  var user1 = {
    email: 'test-user@roadamico.com',
    name: 'A Test user',
    password: 'foo',
    role: 'user'
  };
  var place1 = {
    name: 'test place 1'
  };

  before(function (done) {
    User.create(admin, user1, function () {
      admin = arguments[1];
      user1 = arguments[2];
      Place.create(place1, function () {
        place1 = arguments[1];
        done();
      });
    });
  });

  after(function (done) {
    User.remove({}, function () {
      Place.remove({}, function () {
        done();
      });
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

  describe('POST /api/places/:id/feed', function () {

    it('should require a user to be authorized', function (done) {
      request(app)
        .post('/api/places/' + place1._id + '/feed')
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should let the user post text', function (done) {
      request(app)
        .post('/api/places/' + place1._id + '/feed')
        .send({text: 'this is a test'})
        .set('Authorization', 'Bearer ' + auth.signToken(user1))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.feed[0].text.should.equal('this is a test');
          done();
        });
    });

    it('should let the user upload an image', function (done) {
      request(app)
        .post('/api/places/' + place1._id + '/feed')
        .set('Authorization', 'Bearer ' + auth.signToken(user1))
        .attach('file', 'client/favicon-16x16.png')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.feed[1].photo);
          done();
        });
    });

    it('should let the user upload an image with text', function (done) {
      request(app)
        .post('/api/places/' + place1._id + '/feed')
        .set('Authorization', 'Bearer ' + auth.signToken(user1))
        .attach('file', 'client/favicon-16x16.png')
        .field('text', 'Some other text')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.feed[2].photo);
          res.body.feed[2].text.should.equal('Some other text');
          done();
        });
    });

    it('should let the user embed a URL', function (done) {
      request(app)
        .post('/api/places/' + place1._id + '/feed')
        .send({url: 'http://some.url/foo'})
        .set('Authorization', 'Bearer ' + auth.signToken(user1))
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.feed[3].embed);
          res.body.feed[3].embed.url.should.equal('http://some.url/foo');
          done();
        });
    });

  });


});

'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var auth = require('../../auth/auth.service');
var User = require('./user.model');
var Place = require('../place/place.model');

describe('The User API', function () {

  var user1 = {
    email: 'user-1@roadamico.com',
    name: 'Test User 1',
    password: 'foo',
    role: 'user',
    followingPlaces: [
      {place: '000011112222333344445555'}
    ]
  };

  var place1 = {
    name: 'some place'
  };

  before(function (done) {
    User.create(user1, function (err) {
      user1 = arguments[1];
      Place.create(place1, function () {
        place1 = arguments[1];
        done();
      });
    });
  });

  after(function (done) {
    User.find({}).remove(function () {
      Place.find({}).remove(function () {
        done();
      });
    });
  });


  describe('PUT /api/users/follow/place/:id', function () {

    it('should require the user to be authenticated', function (done) {
      request(app)
        .put('/api/users/follow/place/' + place1._id)
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should add the place to the following list', function (done) {
      request(app)
        .put('/api/users/follow/place/' + place1._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user1))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should(_.find(res.body.followingPlaces, {place: '' + place1._id})).be.ok;
          User.findById(user1._id, function (err, user) {
            should(_.find(user.followingPlaces, function (f) {
              return f.place.equals(place1._id);
            })).be.ok;
            done();
          });
        });
    });
  });

  describe('PUT /api/users/unfollow/place/:id', function () {

    it('should require the user to be authenticated', function (done) {
      request(app)
        .put('/api/users/unfollow/place/' + place1._id)
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should remove the place from the following list', function (done) {
      request(app)
        .put('/api/users/unfollow/place/000011112222333344445555')
        .set('Authorization', 'Bearer ' + auth.signToken(user1))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should(_.find(res.body.followingPlaces, {place: '000011112222333344445555'})).not.be.ok;
          User.findById(user1._id, function (err, user) {
            should(_.find(user.followingPlaces, function (f) {
              return f.place.equals('000011112222333344445555');
            })).not.be.ok;
            done();
          });
        });
    });
  });



});

'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Notification = require('./notification.model');
var moment = require('moment');
var auth = require('../../auth/auth.service');

describe('The notification API', function() {

  var nuser = new User({
    name: 'notify user',
    email: 'notify@user.com',
    password: 'asdf',
    role: 'user'
  });
  var notification1 = {
    datetime: moment().toISOString(),
    data: {message: '1'}
  };
  var notification2 = {
    datetime: moment().toISOString(),
    data: {message: '2'}
  };
  var notification3 = {
    datetime: moment().toISOString(),
    data: {message: '3'}
  };

  before(function (done) {
    User.create(nuser, function (err, doc) {
      nuser = doc;
      notification1.user = nuser._id;
      notification2.user = nuser._id;
      Notification.create(notification1, notification2, notification3, function () {
        notification1 = arguments[1];
        notification2 = arguments[2];
        notification3 = arguments[3];
        done();
      });
    });
  });

  after(function (done) {
    nuser.remove(function () {
      Notification.remove({}, function () {
        done();
      });
    });
  });

  describe('GET /api/notifications', function () {
    it('should require authentication', function (done) {
      request(app)
        .get('/api/notifications')
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should return the user\'s notifications', function (done) {
      request(app)
        .get('/api/notifications')
        .set('Authorization', 'Bearer ' + auth.signToken(nuser))
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.have.length(2);
          done();
        });
    });
  });

  describe('PUT /api/notification/:id/mark', function () {
    it('should require authentication', function (done) {
      request(app)
        .put('/api/notifications/' + notification1._id + '/mark')
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should mark the notification as read', function (done) {
      request(app)
        .put('/api/notifications/' + notification1._id + '/mark')
        .set('Authorization', 'Bearer ' + auth.signToken(nuser))
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.read.should.be.true;
          done();
        });
    });

    it('shouldn\'t find notification that are not owned by the user', function (done) {
      request(app)
        .put('/api/notifications/' + notification3._id + '/mark')
        .set('Authorization', 'Bearer ' + auth.signToken(nuser))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});

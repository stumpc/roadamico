'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var auth = require('../../auth/auth.service');

describe('The utility API', function () {

  var user = {
    email: 'util-user@roadamico.com',
    name: 'Util user',
    password: 'foo',
    role: 'user'
  };

  before(function (done) {
    User.create(user, function (err, doc) {
      user = doc;
      done();
    });
  });

  after(function (done) {
    User.remove({}, function () {
      done();
    });
  });

  describe('The embed endpoint', function () {
    var url = "http://foobar.com/some-thing (else)/baz";

    it('should require a user to be authorized', function (done) {
      request(app)
        .get('/api/utils/embed/' + encodeURIComponent(url))
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should return an object', function (done) {
      request(app)
        .get('/api/utils/embed/' + encodeURIComponent(url))
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.title);
          res.body.url.should.equal(url);
          done();
        });
    });
  });

  describe('The upload endpoint', function () {
    it('should require a user to be authorized', function (done) {
      request(app)
        .post('/api/utils/upload')
        .attach('file', 'client/favicon-16x16.png')
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should return the URL of the image', function (done) {
      request(app)
        .post('/api/utils/upload')
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .attach('file', 'client/favicon-16x16.png')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.url);
          done();
        });
    });
  });

});

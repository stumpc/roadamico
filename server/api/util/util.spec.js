'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('The utility API', function () {

  describe('The embed endpoint', function () {

    it('should return an object', function (done) {
      var url = "http://foobar.com/some-thing (else)/baz";
      request(app)
        .get('/api/utils/embed/' + encodeURIComponent(url))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.title);
          should.exist(res.body.url);
          done();
        });
    });
  });

});

'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Group = require('../group/group.model');
var List = require('./list.model');
var auth = require('../../auth/auth.service');

describe('GET /api/lists', function() {

  //var groups = [{
  //  name: 'group 1',
  //  emails: ['a@b.com']
  //}, {
  //  name: 'group 2',
  //  emails: ['a@b.com']
  //}, {
  //  name: 'group 3'
  //}];
  //var user = {
  //  name: 'user',
  //  email: 'a@b.com',
  //  password: 'asdf',
  //  role: 'user'
  //};
  //var lists = [{
  //  name: 'list 1' // Not restricted
  //}, {
  //  name: 'list 2' // Restricted to group 1 (user is member)
  //}, {
  //  name: 'list 3' // Restricted to group 2 (user is member)
  //}, {
  //  name: 'list 4' // Restricted to group 3 (user is not member)
  //}];
  //
  //before(function (done) {
  //  var i;
  //  Group.create(groups, function () {
  //    for (i = 0; i < groups.length; i++) { groups[i] = arguments[i+1]; }
  //    user.groups = [groups[0]._id, groups[1]._id];
  //    User.create(user, function () {
  //      user = arguments[1];
  //      lists[1].groupRestriction = groups[0]._id;
  //      lists[2].groupRestriction = groups[1]._id;
  //      lists[3].groupRestriction = groups[2]._id;
  //      List.create(lists, function () {
  //        for (i = 0; i < lists.length; i++) { lists[i] = arguments[i+1]; }
  //        done();
  //      });
  //    });
  //  });
  //});
  //
  //after(function (done) {
  //  Group.remove({}, function () {
  //    User.remove({}, function () {
  //      List.remove({}, function () {
  //        done();
  //      });
  //    });
  //  });
  //});
  //
  //describe('GET /api/lists/groups', function () {
  //
  //  it('should respond with lists for groups the user is in', function(done) {
  //    request(app)
  //      .get('/api/lists/groups')
  //      .set('Authorization', 'Bearer ' + auth.signToken(user))
  //      .expect(200)
  //      .expect('Content-Type', /json/)
  //      .end(function(err, res) {
  //        if (err) return done(err);
  //        res.body.should.have.length(2);
  //        res.body.should.containDeep([{name: 'list 2'}]);
  //        res.body.should.containDeep([{name: 'list 3'}]);
  //        done();
  //      });
  //  });
  //
  //});
});

'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Group = require('./group.model');
var auth = require('../../auth/auth.service');

describe('The Groups API', function () {

  var user = new User({
    name: 'group test user',
    email: 'gtu@roadamico.com',
    password: 'asdf',
    role: 'user'
  });
  var user2 = new User({
    name: 'group test user2',
    email: 'gtu2@roadamico.com',
    password: 'asdf',
    role: 'user'
  });
  var user3 = new User({
    name: 'group test user3',
    email: 'gtu3@roadamico.com',
    password: 'asdf',
    role: 'user'
  });
  var admin = new User({
    name: 'group admin user',
    email: 'gau@roadamico.com',
    password: 'asdf',
    role: 'admin'
  });
  var group1 = {
    name: 'g1',
    approved: true,
    emails: ['a@b.com', 'gtu2@roadamico.com']
  };
  var group2 = {
    name: 'g2',
    approved: false,
    emails: ['a@b.com']
  };

  before(function (done) {
    User.create(user, user2, user3, admin, function () {
      user = arguments[1];
      user2 = arguments[2];
      user3 = arguments[3];
      group1.administrator = user._id;
      Group.create(group1, group2, function () {
        group1 = arguments[1];
        group2 = arguments[2];
        done();
      });
    });
  });

  after(function (done) {
    user.remove(function () {
      admin.remove(function () {
        Group.find({}).remove(function () {
          done();
        });
      });
    });
  });

  describe('GET /api/groups', function () {
    it('should list approved groups', function (done) {
      request(app)
        .get('/api/groups')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          should(_.find(res.body, {name: 'g1'})).be.ok;
          should(_.find(res.body, {name: 'g2'})).not.be.ok;
          should.not.exist(res.body[0].emails);
          done();
        });
    });
  });

  describe('GET /api/groups/unapproved', function () {
    it('should require an admin', function (done) {
      request(app)
        .get('/api/groups/unapproved')
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should list unapproved groups', function (done) {
      request(app)
        .get('/api/groups/unapproved')
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          should(_.find(res.body, {name: 'g1'})).not.be.ok;
          should(_.find(res.body, {name: 'g2'})).be.ok;
          done();
        });
    });
  });

  describe('GET /api/groups/:id', function () {
    it('shouldn\'t return groups that the requesting user doesn\'t own', function (done) {
      request(app)
        .get('/api/groups/' + group1._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user2))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should return groups that the requesting user owns', function (done) {
      request(app)
        .get('/api/groups/' + group1._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.name.should.equal(group1.name);
          should.exist(res.body.emails);
          done();
        });
    });

    it('should return groups for admins', function (done) {
      request(app)
        .get('/api/groups/' + group1._id)
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.name.should.equal(group1.name);
          should.exist(res.body.emails);
          done();
        });
    });
  });

  describe('POST /api/groups', function () {
    it('should require an authenticated user', function (done) {
      request(app)
        .post('/api/groups')
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should create a new unapproved group', function (done) {
      request(app)
        .post('/api/groups')
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .attach('file', 'client/favicon-16x16.png')
        .field('name', 'Test group')
        .field('term', 'Summer 2015')
        .field('location', 'Paris, France')
        .field('emails', JSON.stringify(['blue@ra.fr', 'blanc@ra.fr', 'ROUGE@ra.fr']))
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          res.body.name.should.equal('Test group');
          res.body.emails.should.containEql('rouge@ra.fr');
          should.exist(res.body.userVerificationUrl);
          should.exist(res.body.approved);
          res.body.approved.should.be.false;

          done();
        });
    });
  });

  describe('PUT /api/groups/:id', function () {
    it('shouldn\'t find groups that the requesting user doesn\'t own', function (done) {
      request(app)
        .put('/api/groups/' + group1._id)
        .send({term: 'foo1'})
        .set('Authorization', 'Bearer ' + auth.signToken(user2))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should modify groups that the requesting user owns', function (done) {
      request(app)
        .put('/api/groups/' + group1._id)
        .send({term: 'foo2'})
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.name.should.equal(group1.name);
          res.body.term.should.equal('foo2');
          done();
        });
    });

    it('should modify groups for admins', function (done) {
      request(app)
        .put('/api/groups/' + group1._id)
        .send({term: 'foo3'})
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.name.should.equal(group1.name);
          res.body.term.should.equal('foo3');
          done();
        });
    });
  });

  describe('DELETE /api/groups/:id', function () {

    var group3 = {
      name: 'g3',
      approved: true,
      administrator: user._id
    };
    var group4 = {
      name: 'g4',
      approved: true,
      administrator: user._id
    };
    before(function (done) {
      Group.create(group3, group4, function () {
        group3 = arguments[1];
        group4 = arguments[2];
        done();
      })
    });

    it('shouldn\'t find groups that the requesting user doesn\'t own', function (done) {
      request(app)
        .delete('/api/groups/' + group3._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user2))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should delete groups that the requesting user owns', function (done) {
      request(app)
        .delete('/api/groups/' + group3._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          Group.findById(group3._id, function (err, doc) {
            should.not.exist(doc);
            done();
          });
        });
    });

    it('should delete groups for admins', function (done) {
      request(app)
        .delete('/api/groups/' + group4._id)
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          Group.findById(group4._id, function (err, doc) {
            should.not.exist(doc);
            done();
          });
        });
    });
  });

  describe('PUT /api/groups/:id/approve', function () {

    var group = {
      name: 'ugroup',
      approved: false
    };
    before(function (done) {
      Group.create(group, function (err, doc) {
        group = doc;
        done();
      });
    });

    it('should\'t allow non-admins', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/approve')
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should mark a group as approved', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/approve')
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.approved.should.be.true;
          done();
        });
    });
  });

  describe('PUT /api/groups/:id/grant/:rid', function () {

    var group = {
      name: 'ugroup',
      approved: false,
      requests: [{
        email: 'foo1@bar.com'
      }, {
        email: 'foo2@bar.com'
      }],
      administrator: user._id
    };
    before(function (done) {
      Group.create(group, function (err, doc) {
        group = doc;
        done();
      });
    });

    it('shouldn\'t find groups that the requesting user doesn\'t own', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/grant/' + group.requests[0]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user2))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('shouldn\'t find groups with invalid request ids', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/grant/000000000000000000000000')
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should add the request email to the email whitelist', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/grant/' + group.requests[0]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.emails.should.containEql(group.requests[0].email);
          should(_.find(res.body.requests, {email: group.requests[0].email})).not.be.ok;
          done();
        });
    });

    it('should work for admins', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/grant/' + group.requests[1]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.emails.should.containEql(group.requests[1].email);
          should(_.find(res.body.requests, {email: group.requests[1].email})).not.be.ok;
          done();
        });
    });
  });

  describe('PUT /api/groups/:id/deny/:rid', function () {

    var group = {
      name: 'ugroup',
      approved: false,
      requests: [{
        email: 'foo1@bar.com'
      }, {
        email: 'foo2@bar.com'
      }],
      administrator: user._id
    };
    before(function (done) {
      Group.create(group, function (err, doc) {
        group = doc;
        done();
      });
    });

    it('shouldn\'t find groups that the requesting user doesn\'t own', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/deny/' + group.requests[0]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user2))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('shouldn\'t find groups with invalid request ids', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/deny/000000000000000000000000')
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should remove the request', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/deny/' + group.requests[0]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          should(_.find(res.body.requests, {email: group.requests[0].email})).not.be.ok;
          done();
        });
    });

    it('should work for admins', function (done) {
      request(app)
        .put('/api/groups/' + group._id + '/deny/' + group.requests[1]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          should(_.find(res.body.requests, {email: group.requests[1].email})).not.be.ok;
          done();
        });
    });
  });

  describe('PUT /api/groups/:id/invite', function () {

    it('should not allow non-member non-admins', function (done) {
      request(app)
        .put('/api/groups/' + group1._id + '/invite')
        .send({email: 'invite1@me.com'})
        .set('Authorization', 'Bearer ' + auth.signToken(user3))
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should allow members', function (done) {
      request(app)
        .put('/api/groups/' + group1._id + '/invite')
        .send({email: 'invite2@me.com'})
        .set('Authorization', 'Bearer ' + auth.signToken(user2))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          Group.findById(group1._id, function (err, g) {
            g.emails.should.containEql('invite2@me.com');
            done();
          });
        });
    });

    it('should allow the owner', function (done) {
      request(app)
        .put('/api/groups/' + group1._id + '/invite')
        .send({email: 'invite3@me.com'})
        .set('Authorization', 'Bearer ' + auth.signToken(user))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          Group.findById(group1._id, function (err, g) {
            g.emails.should.containEql('invite3@me.com');
            done();
          });
        });
    });

    it('should allow admins', function (done) {
      request(app)
        .put('/api/groups/' + group1._id + '/invite')
        .send({email: 'invite4@me.com'})
        .set('Authorization', 'Bearer ' + auth.signToken(admin))
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          Group.findById(group1._id, function (err, g) {
            g.emails.should.containEql('invite4@me.com');
            done();
          });
        });
    });
  });

});

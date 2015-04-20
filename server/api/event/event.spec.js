'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');
var Place = require('../place/place.model');
var Event = require('./event.model');
var auth = require('../../auth/auth.service');
var moment = require('moment');

describe('GET /api/events', function() {

  // Create mock data
  var users = [{
    name: 'user 1',
    email: 'user_1@roadamico.com',
    password: 'asdf',
    role: 'user'
  }, {
    name: 'user 2',
    email: 'user_2@roadamico.com',
    password: 'asdf',
    role: 'user'
  }, {
    name: 'user 3',
    email: 'user_3@roadamico.com',
    password: 'asdf',
    role: 'user'
  }, {
    name: 'admin user',
    email: 'admin_user@roadamico.com',
    password: 'asdf',
    role: 'admin'
  }];

  var places = [{
    name: 'place 1'
  }, {
    name: 'place 2'
  }];

  var events = [{
    name: 'Event 1'
  }, {
    name: 'Event 2'
  }, {
    name: 'Event 3 (to cancel)'
  }, {
    name: 'Event 4 (to cancel)'
  }, {
    name: 'Event 5'
  }];

  before(function (done) {
    User.create(users, function () {
      for (var i = 0; i < users.length; i++) { users[i] = arguments[i+1]; }
      Place.create(places, function () {
        for (var i = 0; i < places.length; i++) { places[i] = arguments[i+1]; }
        events[0].creator = users[0]._id;
        events[1].creator = users[2]._id;
        events[2].creator = users[0]._id;
        events[3].creator = users[0]._id;
        events[4].creator = users[0]._id;
        events[0].place = places[0]._id;
        events[1].place = places[0]._id;
        events[0].participants = [{participant: users[0]._id}, {participant: users[1]._id}];
        events[2].participants = [{participant: users[0]._id}];
        events[4].participants = [{participant: users[0]._id}, {participant: users[1]._id}];
        events[4].messages = [{poster: users[0]._id, text: 'a test message'}];
        Event.create(events, function () {
          for (var i = 0; i < events.length; i++) { events[i] = arguments[i+1]; }
          done();
        });
      });
    });
  });

  after(function(done) {
    User.remove({}, function () {
      Place.remove({}, function () {
        Event.remove({}, function () {
          done();
        });
      });
    });
  });


  describe('GET /api/events/:id', function () {
    it('should respond w/ a 404 for an invalid place', function (done) {
      request(app)
        .get('/api/events/000000000000000000000000')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should contain the names of the participants', function (done) {
      request(app)
        .get('/api/events/' + events[0]._id)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.participants.should.have.length(2);
          res.body.participants.should.containDeep([{participant: {name: 'user 1'}}]);
          res.body.participants.should.containDeep([{participant: {name: 'user 2'}}]);
          done();
        });
    });

    it('should contain the names of message posters', function (done) {
      request(app)
        .get('/api/events/' + events[4]._id)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.messages[0].poster.name.should.equal('user 1');
          done();
        });
    });
  });


  describe('GET /api/events/place/:id', function () {
    it('should respond no events for an invalid place', function (done) {
      request(app)
        .get('/api/events/place/000000000000000000000000')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.have.length(0);
          done();
        });
    });

    it('should respond with a list of only events for that place', function (done) {
      request(app)
        .get('/api/events/place/' + places[0]._id)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.length(2);
          res.body.should.containDeep([{name: 'Event 1'}]);
          res.body.should.containDeep([{name: 'Event 2'}]);
          done();
        });
    });
  });

  describe('POST /api/events', function () {
    it('should require authorization', function (done) {
      request(app)
        .post('/api/events')
        .send({name: 'new event 1'})
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should fail if no place ID is given', function (done) {
      request(app)
        .post('/api/events')
        .set('Authorization', 'Bearer ' + auth.signToken(users[0]))
        .send({name: 'new event 2'})
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.message);
          done();
        });
    });

    it('should create the event without messages and w/ the creator as the only participant', function (done) {
      request(app)
        .post('/api/events')
        .set('Authorization', 'Bearer ' + auth.signToken(users[0]))
        .send({
          name: 'new event 3',
          place: places[0]._id,
          participants: [{
            participant: users[1]._id, datetime: moment().toISOString()
          }],
          messages: [{
            text: 'test', poster: users[0]._id, datetime: moment().toISOString()
          }]
        })
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.name.should.equal('new event 3');
          res.body.participants.should.have.length(1);
          res.body.participants[0].participant.should.equal('' + users[0]._id);
          res.body.messages.should.have.length(0);
          done();
        });
    });
  });


  describe('PUT /api/events/:id', function () {
    it('should require authorization', function (done) {
      request(app)
        .put('/api/events/' + events[0]._id)
        .send({meetupTime: '1:00 pm'})
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should allow the creator to modify', function (done) {
      request(app)
        .put('/api/events/' + events[0]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(users[0]))
        .send({meetupTime: '2:00 pm'})
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.meetupTime.should.equal('2:00 pm');
          done();
        });
    });

    it('should not allow other users to modify', function (done) {
      request(app)
        .put('/api/events/' + events[0]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(users[1]))
        .send({meetupTime: '3:00 pm'})
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.message);
          done();
        });
    });

    it('should allow admins to modify', function (done) {
      request(app)
        .put('/api/events/' + events[0]._id)
        .set('Authorization', 'Bearer ' + auth.signToken(users[3]))
        .send({meetupTime: '4:00 pm'})
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.meetupTime.should.equal('4:00 pm');
          done();
        });
    });
  });


  describe('PUT /api/events/:id/cancel', function () {
    it('should require authorization', function (done) {
      request(app)
        .put('/api/events/' + events[2]._id + '/cancel')
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should allow the creator to cancel', function (done) {
      request(app)
        .put('/api/events/' + events[2]._id + '/cancel')
        .set('Authorization', 'Bearer ' + auth.signToken(users[0]))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.canceled.should.be.true;
          done();
        });
    });

    it('should not allow other users to cancel', function (done) {
      request(app)
        .put('/api/events/' + events[3]._id + '/cancel')
        .set('Authorization', 'Bearer ' + auth.signToken(users[1]))
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.message);
          done();
        });
    });

    it('should allow admins to cancel', function (done) {
      request(app)
        .put('/api/events/' + events[3]._id + '/cancel')
        .set('Authorization', 'Bearer ' + auth.signToken(users[3]))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.canceled.should.be.true;
          done();
        });
    });
  });


  describe('PUT /api/events/:id/join', function () {
    it('should require authorization', function (done) {
      request(app)
        .put('/api/events/' + events[1]._id + '/join')
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should join the user', function (done) {
      request(app)
        .put('/api/events/' + events[1]._id + '/join')
        .set('Authorization', 'Bearer ' + auth.signToken(users[0]))
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.participants.should.have.length(1);
          res.body.participants.should.containDeep([{participant: {_id: '' + users[0]._id}}]);
          should.exist(res.body.participants[0].datetime);
          done();
        });
    });

    it('should not allow a user to join twice', function (done) {
      request(app)
        .put('/api/events/' + events[1]._id + '/join')
        .set('Authorization', 'Bearer ' + auth.signToken(users[0]))
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.message);
          done();
        });
    });
  });


  describe('POST /api/events/:id/message', function () {
    it('should require authorization', function (done) {
      request(app)
        .post('/api/events/' + events[0]._id + '/message')
        .send({text: 'test 1'})
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('should not allow non-attending users to message', function (done) {
      request(app)
        .post('/api/events/' + events[0]._id + '/message')
        .set('Authorization', 'Bearer ' + auth.signToken(users[2]))
        .send({text: 'test 2'})
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body.message);
          done();
        });
    });

    it('should allow attending users to message', function (done) {
      request(app)
        .post('/api/events/' + events[0]._id + '/message')
        .set('Authorization', 'Bearer ' + auth.signToken(users[0]))
        .send({text: 'test 3'})
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.messages.should.have.length(1);
          res.body.messages.should.containDeep([{text: 'test 3'}]);
          done();
        });
    });
  });
});

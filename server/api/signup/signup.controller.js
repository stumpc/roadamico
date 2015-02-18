'use strict';

var _ = require('lodash');
var Signup = require('./signup.model');
var emails = require('../../components/emails');
var moment = require('moment');

// Get list of signups
exports.index = function(req, res) {
  Signup.find(function (err, signups) {
    if(err) { return handleError(res, err); }
    return res.json(200, signups);
  });
};

// Creates a new signup in the DB.
exports.create = function(req, res) {

  req.body.date = moment().toISOString();

  Signup.create(req.body, function(err, signup) {
    if(err) { return handleError(res, err); }

    // Send an email
    emails.create('signup', {
      to: signup.email,
      subject: 'Thank you for signing up with RoadAmico'
    }).send();

    // If there is a referral, send them an email too (#88557886)
    if (signup.refer) {
      emails.create('referral', {
        to: signup.refer,
        subject: 'Join your friends on RoadAmico'
      }, {
        referrer: signup.email
      }).send();
    }

    return res.json(201, signup);
  });
};

// Deletes a signup from the DB.
exports.destroy = function(req, res) {
  Signup.findById(req.params.id, function (err, signup) {
    if(err) { return handleError(res, err); }
    if(!signup) { return res.send(404); }
    signup.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

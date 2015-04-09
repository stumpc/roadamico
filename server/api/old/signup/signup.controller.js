'use strict';

var _ = require('lodash');
var Signup = require('./signup.model.js');
var User = require('../user/user.model');
var communication = require('../../components/communication');
var moment = require('moment');
var genCode = require('../../components/genCode');
var translate = require('../../components/translate');
var config = require('../../config/environment');

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
    communication.email('signup', {
      req: req,
      email: signup.email
    });

    // If there is a referral, send them an email too (#88557886)
    if (signup.refer) {
      communication.email('referral', {
        req: req,
        email: signup.refer,
        view: {
          referrer: signup.email
        }
      });
    }

    return res.json(201, signup);
  });
};

exports.grant = function (req, res) {
  Signup.findById(req.params.id, function (err, signup) {
    if(err) { return handleError(res, err); }
    if(!signup) { return res.send(404); }

    // Create an account w/ a random modCode
    User.create({
      email: signup.email,
      modCode: genCode(),
      password: genCode(),
      joined: moment().toISOString(),
      emailPrefs: config.userSettings.emailPrefs
    }, function (err, user) {
      if (err) { return handleError(res, err); }
      if (!user) return res.json(404, { message: translate(req, 'no-user-created') });

      communication.email('grantAccess', {
        email: signup.email,
        user: user,
        view: {
          id: user._id,
          modCode: user.modCode
        }
      });

      return res.json(200, { message: translate(req, 'access-granted') });
    });
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

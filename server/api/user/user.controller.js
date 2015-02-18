'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var cloudinary = require('cloudinary');
var fs = require('fs');
var moment = require('moment');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword -financial', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Get list of all users' profile
 */
exports.profiles = function(req, res) {
  User.find({}, function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users.map(function (user) {
      return user.profile;
    }));
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  if (!config.appLive) return res.json(403, { message: "RoadAmico isn't allowing open registration yet." });

  var newUser = new User(req.body);
  newUser.joined = moment().toISOString();
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.finished = true;

  newUser.save(function (err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
    res.json({token: token});
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Updates a user's profile
 */
exports.update = function(req, res, next) {

  // Delete information that the user can't change
  delete req.body.verification;
  delete req.body.activated;
  delete req.body.role;

  var updated = _.merge(req.user, req.body);
  updated.categories = req.body.categories;
  updated.save(function (err, user) {
    if (err) return validationError(res, err);

    delete updated.salt;
    delete updated.hashedPassword;
    res.json(user);
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/home');
};

/**
 * Uploading a profile picture
 */
exports.uploadImage = function (req, res, next) {

  var img = req.files.file;
  cloudinary.uploader.upload(img.path, function(result) {
    fs.unlinkSync(img.path); // Delete the file

    // Save the user
    req.user.photo = result.url;
    req.user.save(function (err, user) {
      if (err) return next(err);
      res.send(user.photo);
    });
  });

};

exports.saveCard = function (req, res, next) {
  if(req.user.authenticate(req.body.password)) {

    // Validate
    var card = req.body.card;
    if (!card || !card.number || !card.cvc || !card.exp.month || !card.exp.year || card.exp.month < 1 ||
        card.exp.month > 12) {
      return validationError(res, {message: 'Invalid card data'});
    }

    req.user.addCard(card, req.body.password);
    req.user.save(function (err, user) {
      if (err) return next(err);
      res.json(user.financial);
    });

  } else {
    res.send(403);
  }
};

exports.deleteCard = function (req, res, next) {
  var found = false;
  for (var i = 0; i < req.user.financial.cards.length; i++) {
    if (req.user.financial.cards[i]._id = req.params.id) {
      found = true;
      req.user.financial.cards.splice(i, 1);
      req.user.save(function (err, user) {
        if (err) return next(err);
        res.json(user.financial);
      });
      break;
    }
  }
  if (!found) {
    res.send(404);
  }
};

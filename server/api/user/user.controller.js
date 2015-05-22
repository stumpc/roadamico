'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var _ = require('lodash');
var upload = require('../../components/upload');
var moment = require('moment');
var auth = require('../../auth/auth.service');
var genCode = require('../../components/genCode');
var email = require('../../components/communication/email');
var translate = require('../../components/translate');
var Group = require('../group/group.model');
var List = require('../list/list.model');
var Event = require('../event/event.model');
var Place = require('../place/place.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.check = function (req, res) {
  User.findOne({email: req.params.email.toLowerCase()}, function (err, user) {
    if(err) return res.send(500, err);
    res.json({available: !user});
  });
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword -financial').sort({ name: 'asc' }).exec(function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Get list of all users' profile
 */
exports.profiles = function(req, res) {
  User.find({activated: true}, function (err, users) {
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
  if (!config.appLive) return res.json(403, { message: translate(req, 'no-open-registration') });

  var newUser = new User(req.body);
  newUser.joined = moment().toISOString();
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.finished = true;
  newUser.activated = true;
  newUser.emailPrefs = config.userSettings.emailPrefs;

  newUser.save(function (err, user) {
    if (err) return validationError(res, err);
    var token = auth.signToken(user);
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
    if (!user.activated) return res.send(404);
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
      user.pwResetBy = '';
      user.modCode = '';
      if (user.email && !user.activated) user.activated = true;

      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403, {message: translate(req, 'invalid-password')});
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
  delete req.body.following;

  var updated = _.merge(req.user, req.body);
  if (req.body.languages) {
    updated.languages = req.body.languages;
    updated.markModified('languages');
  }
  if (req.body.groups) {
    updated.groups = req.body.groups;
    updated.markModified('groups');
  }

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
  upload.image(req.files.file)
    .then(function (url) {
      req.user.photo = url;
      req.user.save(function (err, user) {
        if (err) return next(err);
        res.send(user.photo);
      });
    });
};

exports.resetPassword = function (req, res, next) {

  User.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
    if (err) return res.json(500, err);
    if (!user) return res.json(404, { message: translate(req, 'no-user-found') });

    user.modCode = genCode();
    user.pwResetBy = moment().add(2, 'days').toISOString();
    user.save(function (err) {
      if (err) return res.json(500, err);

      email('resetPassword', {
        user: user,
        req: req,
        view: {
          email: user.email,
          id: user._id,
          modCode: user.modCode
        }
      });

      res.send(200);
    });
  });
};

exports.follow = function (req, res) {
  var collection = req.user.following[req.params.target+'s'];
  var target = _.find(collection, function (f) {
    return f[req.params.target].equals(req.params.id);
  });
  if (target) {
    res.send(200);
  } else {
    var addition = { datetime: moment().toISOString() };
    addition[req.params.target] = req.params.id;
    collection.push(addition);
    req.user.save(function (err, user) {
      if (err) return res.json(500, err);
      res.json(user);
    });
  }
};

exports.unfollow = function (req, res) {
  var collection = req.user.following[req.params.target+'s'];
  var targetIdx = _.findIndex(collection, function (f) {
    return f[req.params.target].equals(req.params.id);
  });
  if (targetIdx === -1) {
    res.send(200);
  } else {
    collection.splice(targetIdx, 1);
    req.user.save(function (err, user) {
      if (err) return res.json(500, err);
      res.json(user);
    });
  }
};

/**
 * A feed is made up of:
 * - List entries
 * - Place feed posts
 * - Events
 *
 * @param req
 * @param res
 */
exports.feed = function (req, res) {
  var lists = _.map(req.user.following.lists, 'list');
  var places = _.map(req.user.following.places, 'place');

  List.find({_id: {$in: lists}})
    .populate('entries.poster', 'name')
    .populate('entries.place', 'locationDetails feed ratings')
    .exec(function (err, lists) {
      if (err) return res.json(500, err);

      Place.find({_id: {$in: places}})
        .populate('feed.poster', 'name')
        .exec(function (err, places) {
          if (err) return res.json(500, err);

          Event.find({place: {$in: places}})
            .populate('creator', 'name')
            .populate('place', 'locationDetails')
            .exec(function (err, events) {
              if (err) return res.json(500, err);
              res.json({
                lists: lists,
                places: places,
                events: events
              });
            });
        });
    });

};

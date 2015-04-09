'use strict';

var _ = require('lodash');
var moment = require('moment');
var Rating = require('./rating.model.js');
var Availability = require('../availability/availability.model.js');
var Service = require('../service/service.model');
var mp = require('../../components/mongoosePromise');
var translate = require('../../components/translate');

exports.list = function (req, res, next) {
  Rating.find({ provider: req.params.id }, '-rater -booking', function (err, ratings) {
    if (err) return next(err);
    res.json(ratings);
  });
};

exports.create = function (req, res, next) {

  if (typeof req.body.provider === 'object') {
    req.body.provider = req.body.provider._id;
  }
  if (typeof req.body.booking === 'object') {
    req.body.booking = req.body.booking._id;
  }

  mp.wrap(Availability.findById(req.body.booking).populate('service', 'provider'))
    .then(function (availability) {

      // First check that the user is allowed to rate
      var validProvider = availability.service.provider.equals(req.body.provider);
      var validRater    = req.user._id.equals(availability.booking.booker);
      var validTime     = moment(availability.datetime) < moment();
      if (!validProvider || !validRater || !validTime) {
        throw { code: 403, message: translate(req, 'rating-unauthorized') };
      }

      // Mark the availability as rated
      availability.service = availability.service._id;
      availability.booking.updates.push({
        status: 'rated',
        time: moment().toISOString()
      });
      return mp.wrap(availability, 'save');
    })
    .then(function () {

      // Create the rating
      req.body.datetime = moment().toISOString();
      req.body.rater = req.user._id;
      return mp.wrapCall(function (cb) { Rating.create(req.body, cb); });
    })
    .then(function (rating) {
      res.json(201, rating);
    })
    .catch(function (err) {
      if (err.code) {
        res.json(err.code, err);
      } else {
        next(err);
      }
    });

};

exports.mine = function (req, res, next) {
  Rating.find({ rater: req.user._id }, function (err, ratings) {
    if (err) return next(err);
    res.json(ratings);
  });
};

// Get list of ratings
//exports.index = function(req, res) {
//  Rating.find(function (err, ratings) {
//    if(err) { return handleError(res, err); }
//    return res.json(200, ratings);
//  });
//};
//
//// Get a single rating
//exports.show = function(req, res) {
//  Rating.findById(req.params.id, function (err, rating) {
//    if(err) { return handleError(res, err); }
//    if(!rating) { return res.send(404); }
//    return res.json(rating);
//  });
//};
//
//// Creates a new rating in the DB.
//exports.create = function(req, res) {
//  Rating.create(req.body, function(err, rating) {
//    if(err) { return handleError(res, err); }
//    return res.json(201, rating);
//  });
//};
//
//// Updates an existing rating in the DB.
//exports.update = function(req, res) {
//  if(req.body._id) { delete req.body._id; }
//  Rating.findById(req.params.id, function (err, rating) {
//    if (err) { return handleError(res, err); }
//    if(!rating) { return res.send(404); }
//    var updated = _.merge(rating, req.body);
//    updated.save(function (err) {
//      if (err) { return handleError(res, err); }
//      return res.json(200, rating);
//    });
//  });
//};
//
//// Deletes a rating from the DB.
//exports.destroy = function(req, res) {
//  Rating.findById(req.params.id, function (err, rating) {
//    if(err) { return handleError(res, err); }
//    if(!rating) { return res.send(404); }
//    rating.remove(function(err) {
//      if(err) { return handleError(res, err); }
//      return res.send(204);
//    });
//  });
//};


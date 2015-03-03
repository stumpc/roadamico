'use strict';

var _ = require('lodash');
var moment = require('moment');
var Availability = require('./availability.model');
var Service = require('../service/service.model');

// Get list of availabilities
//exports.index = function(req, res) {
//  Availability.find(function (err, availabilities) {
//    if(err) { return handleError(res, err); }
//    return res.json(200, availabilities);
//  });
//};

exports.getAll = function (req, res) {
  Availability.find({
    service: req.params.id
  }).exec(function (err, availabilities) {
    if(err) { return handleError(res, err); }
    return res.json(availabilities);
  });
};

exports.getUpcoming = function (req, res) {
  Availability.find({
    service: req.params.id,
    timestamp: { $gte: moment().valueOf() }
  }).exec(function (err, availabilities) {
    if(err) { return handleError(res, err); }
    return res.json(availabilities);
  });
};

// Get a single availability
exports.show = function(req, res) {
  Availability.findById(req.params.id, function (err, availability) {
    if(err) { return handleError(res, err); }
    if(!availability) { return res.send(404); }
    return res.json(availability);
  });
};

// Creates a new availability in the DB.
exports.create = function(req, res) {

  req.body.timestamp = moment(req.body.datetime).valueOf();
  if (typeof req.body.service === 'object') {
    req.body.service = req.body.service._id;
  }

  Service.findById(req.body.service).exec(function (err, service) {
    if (err) { return handleError(res, err); }

    // Check the service
    if (service.provider.equals(req.user._id)) {
      Availability.create(req.body, function(err, availability) {
        if(err) { return handleError(res, err); }
        return res.json(201, availability);
      });
    } else {
      return res.json(403, { message: 'Unauthorized. Not your service.' });
    }
  });
};

// Updates an existing availability in the DB.
exports.update = function(req, res) {

  delete req.body._id;
  if (req.body.datetime) {
    req.body.timestamp = moment(req.body.datetime).valueOf();
  }
  if (typeof req.body.service === 'object') {
    req.body.service = req.body.service._id;
  }

  Service.findById(req.body.service).exec(function (err, service) {
    if (err) { return handleError(res, err); }

    // Check the service
    if (service.provider.equals(req.user._id)) {
      Availability.findById(req.params.id, function (err, availability) {
        if (err) { return handleError(res, err); }
        if(!availability) { return res.send(404); }

        var updated = _.merge(availability, req.body);
        updated.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.json(200, availability);
        });
      });

    } else {
      return res.json(403, { message: 'Unauthorized. Not your service.' });
    }
  });
};

// Deletes a availability from the DB.
exports.destroy = function(req, res) {
  Availability.findById(req.params.id, function (err, availability) {
    if(err) { return handleError(res, err); }
    if(!availability) { return res.send(404); }
    availability.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

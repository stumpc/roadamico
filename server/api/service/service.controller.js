'use strict';

var _ = require('lodash');
var Service = require('./service.model');

// Get list of services
exports.index = function(req, res) {
  Service.find().populate('provider').exec(function (err, services) {
    if(err) { return handleError(res, err); }
    return res.json(200, services);
  });
};

// Get a single service
exports.show = function(req, res) {
  Service.findById(req.params.id, function (err, service) {
    if(err) { return handleError(res, err); }
    if(!service) { return res.send(404); }
    return res.json(service);
  });
};

// Creates a new service in the DB.
exports.create = function(req, res) {

  // TODO: Auto populate the provider with the user's ID

  Service.create(req.body, function(err, service) {
    if(err) { return handleError(res, err); }
    return res.json(201, service);
  });
};

// Updates an existing service in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Service.findById(req.params.id, function (err, service) {
    if (err) { return handleError(res, err); }
    if(!service) { return res.send(404); }

    // TODO: Check that the provider matches the user

    var updated = _.merge(service, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, service);
    });
  });
};

// Deletes a service from the DB.
exports.destroy = function(req, res) {
  Service.findById(req.params.id, function (err, service) {
    if(err) { return handleError(res, err); }
    if(!service) { return res.send(404); }

    // TODO: Check that the provider matches the user

    service.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

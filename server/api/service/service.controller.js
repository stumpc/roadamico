'use strict';

var _ = require('lodash');
var Service = require('./service.model');

// Get list of services
exports.index = function(req, res) {
  Service.find().populate('provider', 'name photo').exec(function (err, services) {
    if(err) { return handleError(res, err); }
    return res.json(200, services);
  });
};

exports.listByProvider = function(req, res) {
  Service.find({ provider: req.params.id }).exec(function (err, services) {
    if(err) { return handleError(res, err); }
    return res.json(200, services);
  });
};

// Get a single service
exports.show = function(req, res) {
  Service.findById(req.params.id).populate('provider', 'name photo').exec(function (err, service) {
    if(err) { return handleError(res, err); }
    if(!service) { return res.send(404); }
    return res.json(service);
  });
};

// Creates a new service in the DB.
exports.create = function(req, res) {

  // Auto populate the provider with the user's ID
  req.body.provider = req.user._id;
  Service.create(req.body, function(err, service) {
    if(err) { return handleError(res, err); }
    return res.json(201, service);
  });
};

// Updates an existing service in the DB.
exports.update = function(req, res) {
  delete req.body._id;
  delete req.body.provider;

  Service.findById(req.params.id, function (err, service) {
    if (err) { return handleError(res, err); }
    if(!service) { return res.send(404); }

    // Check that the provider matches the user
    if (!req.user._id.equals(service.provider)) { return res.json(403, { message: 'Unauthorized to modify. Not your service!' }); }

    var updated = _.merge(service, req.body);
    updated.availability = service.availability; // Don't update the availability slots here (lodash doesn't merge well)
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

    // Check that the provider matches the user
    if (!req.user._id.equals(service.provider)) { return res.json(403, { message: 'Unauthorized to modify. Not your service!' }); }

    service.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

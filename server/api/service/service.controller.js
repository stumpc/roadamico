'use strict';

var _ = require('lodash');
var Service = require('./service.model');

// Get list of services
exports.index = function (req, res) {
  Service.find()
    .populate('provider', 'name photo').populate('category', 'name color icon').exec(function (err, services) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, services);
    });
};

exports.listByProvider = function (req, res) {
  Service.find({provider: req.params.id}).populate('category', 'name color icon').exec(function (err, services) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, services);
  });
};

// Get a single service
exports.show = function (req, res) {
  Service.findById(req.params.id)
    .populate('provider', 'name photo').populate('category', 'name color icon').exec(function (err, service) {
      if (err) {
        return handleError(res, err);
      }
      if (!service) {
        return res.send(404);
      }
      return res.json(service);
    });
};

// Creates a new service in the DB.
exports.create = function (req, res) {

  // Auto populate the provider with the user's ID
  req.body.provider = req.user._id;

  // Possibly fix the category
  if (typeof req.body.category === 'object') {
    req.body.category = req.body.category._id || req.body.category.id;
  }

  Service.create(req.body, function (err, service) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, service);
  });
};

// Updates an existing service in the DB.
exports.update = function (req, res) {
  delete req.body._id;
  delete req.body.provider;

  // Possibly fix the category
  if (typeof req.body.category === 'object') {
    req.body.category = req.body.category._id || req.body.category.id;
  }

  Service.findById(req.params.id, function (err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.send(404);
    }

    // Check that the provider matches the user
    if (!req.user._id.equals(service.provider)) {
      return res.json(403, {message: 'Unauthorized to modify. Not your service!'});
    }

    var updated = _.merge(service, req.body);

    // Don't use updated arrays. Lodash ruins them
    updated.details = req.body.details;
    updated.availability = service.availability;

    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      Service.populate(service, [{path: 'provider', select: 'name photo'}, {path: 'category', select: 'name color icon'}], function (err, s2) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, s2);
      });
    });
  });
};

// Deletes a service from the DB.
exports.destroy = function (req, res) {
  Service.findById(req.params.id, function (err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.send(404);
    }

    // Check that the provider matches the user
    if (!req.user._id.equals(service.provider)) {
      return res.json(403, {message: 'Unauthorized to modify. Not your service!'});
    }

    service.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

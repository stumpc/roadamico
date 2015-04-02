'use strict';

var _ = require('lodash');
var Service = require('./service.model');
var Search = require('../../components/search/search');
var translate = require('../../components/translate');
var moment = require('moment');

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
  Service.find({provider: req.params.id})
    .populate('provider', 'name photo').populate('category', 'name color icon').exec(function (err, services) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, services);
    });
};

exports.listByCategory = function (req, res) {
  Service.find({category: req.params.id})
    .populate('provider', 'name photo').populate('category', 'name color icon').exec(function (err, services) {
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
  if (req.body.category && typeof req.body.category === 'object') {
    req.body.category = req.body.category._id || req.body.category.id;
  }

  req.body.created = moment().toISOString();
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
  if (req.body.category && typeof req.body.category === 'object') {
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
      return res.json(403, {message: translate(req, 'service-unauthorized') });
    }

    var updated = _.merge(service, req.body);

    // Don't use updated arrays. Lodash ruins them
    updated.details = req.body.details;
    updated.availability = service.availability;

    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      Service.populate(service, [{path: 'provider', select: 'name photo'}, {
        path: 'category',
        select: 'name color icon'
      }], function (err, s2) {
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
      return res.json(403, {message: translate(req, 'service-unauthorized') });
    }

    service.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

/**
 * Location search:
 *  - Name matches
 *  - Great circle distance between lat/lng points
 *
 * Service search:
 *  - Name matches of service name, category name, or category alias names
 *
 * @param req
 * @param res
 */
exports.search = function (req, res) {
  var search = new Search();

  Service.find({})
    .populate('provider', 'name photo').populate('category', 'name color icon aliases').exec(function (err, services) {

      var results = {};

      function saveResult(id, score, combineOp) {
        combineOp = combineOp || function (a,b) {return (a+b) / 2;}; // Average is the default combine operator
        if (!results[id]) {
          results[id] = score;
        } else {
          results[id] = combineOp(results[id], score);
        }
      }

      if (services && services.length) {
        services.forEach(function (service) {
          // Name search first, also looking at aliases
          if (req.body.name) {
            saveResult(service._id, search.scoreText(service.name, req.body.name));
          }
          if (service.aliases) {
            service.aliases.forEach(function (alias) {
              saveResult(service._id, search.scoreText(alias, req.body.name), Math.max);
            });
          }

          // Distance search
          if (req.body.position && service.locationDetails && service.locationDetails.geometry) {
            var position = [service.locationDetails.geometry.location.k, service.locationDetails.geometry.location.D];
            saveResult(service._id, search.scoreDist(position, req.body.position));
          }

          // Location name search (only when position not provided)
          if (!req.body.position && req.body.location && service.location) {
            saveResult(service._id, search.scoreText(service.location, req.body.location));
          }
        });
      }

      res.json(200, search.finalize(results));

    });
};

function handleError(res, err) {
  return res.send(500, err);
}

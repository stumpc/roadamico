'use strict';

var _ = require('lodash');
var Service = require('./service.model');
var Search = require('../../components/search/search');

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

      function saveResult(id, score) {
        if (!results[id]) {
          results[id] = score;
        } else {
          results[id] = Math.max(score, results[id]);
        }
      }

      services.forEach(function (service) {
        // Distance search
        if (req.body.position && service.locationDetails && service.locationDetails.geometry) {
          var position = [service.locationDetails.geometry.location.k, service.locationDetails.geometry.location.D];
          saveResult(service._id, search.scoreDist(position, req.body.position));
        }

        // Location name search (only when position not provided)
        if (!req.body.position && req.body.location && service.location) {
          saveResult(service._id, search.scoreText(service.location, req.body.location));
        }

        // Name search
        if (req.body.name) {
          saveResult(service._id, search.scoreText(service.name, req.body.name));
        }
        if (service.aliases) {
          service.aliases.forEach(function (alias) {
            saveResult(service._id, search.scoreText(alias, req.body.name));
          });
        }
      });
      //
      //// Distance search
      //if (req.body.position && req.body.position.length) {
      //  results = results.concat(services.filter(function (service) {
      //    return service.locationDetails && service.locationDetails.geometry;
      //  }).map(function (service) {
      //    var position = [service.locationDetails.geometry.location.k, service.locationDetails.geometry.location.D];
      //    return [search.scoreDist(position, req.body.position), service._id];
      //  }));
      //}
      //
      //// Location name search (only when position not provided)
      //if (!req.body.position && req.body.location) {
      //  results = results.concat(services.filter(function (service) {
      //    return service.location;
      //  }).map(function (service) {
      //    return [search.scoreText(service.location, req.body.location), service._id];
      //  }));
      //}

      // Name
      //if (req.body.name) {
      //  // Name of service
      //  results = results.concat(services.map(function (service) {
      //    return [search.scoreText(service.name, req.body.name), service._id];
      //  }));
      //
      //  // Name of category
      //  results = results.concat(services.map(function (service) {
      //    var score = search.scoreText(service.category.name, req.body.name);
      //
      //    // Aliases of category
      //    if (service.aliases) {
      //      service.aliases.forEach(function (alias) {
      //        score = Math.max(score, search.scoreText(alias, req.body.name));
      //      });
      //    }
      //    return [score, service._id];
      //  }));
      //}

      // TODO: Reduce
      //var merged = [];
      //merged.concat.apply(merged, results);
      var sorted =_(Object.keys(results).map(function (id) {
        return {
          id: id,
          score: results[id]
        };
      })).sortBy('score').value().reverse();
      res.json(200, sorted);

    });
};

function handleError(res, err) {
  return res.send(500, err);
}

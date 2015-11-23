'use strict';

var _ = require('lodash');
var Journey = require('./journey.model');
var upload = require('../../components/upload');

// Get list of journeys
exports.index = function(req, res) {
  Journey.find({}, function(err, journeys) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(journeys);
  });
};

// Get a single journey
exports.show = function(req, res) {
  Journey.findById(req.params.id, function(err, journey) {
    if (err) {
      return handleError(res, err);
    }
    if (!journey) {
      return res.status(404).send('Not Found');
    }
    return res.json(journey);
  });
};

// Creates a new journey in the DB.
exports.create = function(req, res) {
  Journey.create(req.body, function(err, journey) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(journey);
  });
};

// Updates an existing journey in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Journey.findById(req.params.id, function(err, journey) {
    if (err) {
      return handleError(res, err);
    }
    if (!journey) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(journey, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(journey);
    });
  });
};

// Deletes a journey from the DB.
exports.destroy = function(req, res) {
  Journey.findById(req.params.id, function(err, journey) {
    if (err) {
      return handleError(res, err);
    }
    if (!journey) {
      return res.status(404).send('Not Found');
    }
    journey.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
'use strict';

var _ = require('lodash');
var Place = require('./place.model');
var moment = require('moment');
var upload = require('../../components/upload');
var Q = require('q');

// Get list of places
exports.index = function(req, res) {
  Place.find(function (err, places) {
    if(err) { return handleError(res, err); }
    return res.json(200, places);
  });
};

// Get a single place
exports.show = function(req, res) {
  Place.findById(req.params.id, function (err, place) {
    if(err) { return handleError(res, err); }
    if(!place) { return res.send(404); }
    return res.json(place);
  });
};

// Creates a new place in the DB.
exports.create = function(req, res) {
  Place.create(req.body, function(err, place) {
    if(err) { return handleError(res, err); }
    return res.json(201, place);
  });
};

// Updates an existing place in the DB.
exports.update = function(req, res) {
  delete req.body._id;
  delete req.body.photos;
  delete req.body.updates;
  delete req.body.ratings;
  delete req.body.promoted;

  Place.findById(req.params.id, function (err, place) {
    if (err) { return handleError(res, err); }
    if(!place) { return res.send(404); }
    var updated = _.merge(place, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, place);
    });
  });
};


exports.addPost = function (req, res) {
  Place.findById(req.params.id, function (err, place) {
    if (err) { return handleError(res, err); }
    if(!place) { return res.send(404); }

    var promise;
    if (req.files && req.files.file) {
      promise = upload.image(req.files.file);
    } else {
      promise = Q();
    }

    promise.then(function (photo) {
      place.feed.push({
        datetime: moment().toISOString(),
        photo: photo,
        text: req.body.text,
        embed: req.body.embed,
        poster: req.user._id
      });
      place.save(function (err, place) {
        if (err) return next(err);
        res.send(place);
      });
    });
  });
};

exports.removePost = function (req, res) {
  Place.findById(req.params.id, function (err, place) {
    if (err) { return handleError(res, err); }
    if(!place) { return res.send(404); }

    var postIdx = _.findIndex(place.feed, function (update) {
      return update._id.equals(req.params.fid);
    });
    if (postIdx === -1) return res.send(404);
    var post = place.feed[postIdx];

    if (!post.poster.equals(req.user._id) && req.user.role !== 'admin') return res.send(403);

    place.feed.splice(postIdx, 1);
    place.save(function (err, place) {
      if (err) return next(err);
      res.send(place);
    });
  });
};

// Deletes a place from the DB.
exports.destroy = function(req, res) {
  Place.findById(req.params.id, function (err, place) {
    if(err) { return handleError(res, err); }
    if(!place) { return res.send(404); }
    place.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.rate = function (req, res) {
  Place.findById(req.params.id, function (err, place) {
    if(err) { return handleError(res, err); }
    if(!place) { return res.send(404); }

    // See if this user has already rated
    var rating = _.find(place.ratings, function (rating) {
      return req.user._id.equals(rating.poster);
    });
    if (rating) {
      rating.datetime = moment().toISOString();
      rating.score = req.body.score;
    } else {
      place.ratings.push({
        datetime: moment().toISOString(),
        poster: req.user._id,
        score: req.body.score
      });
    }

    place.save(function(err, place) {
      if(err) { return handleError(res, err); }
      return res.send(200, place);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

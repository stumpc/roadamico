'use strict';

var _ = require('lodash');
var List = require('./list.model');
var moment = require('moment');
var upload = require('../../components/upload');
var Q = require('q');

// Get list of lists
exports.index = function(req, res) {
  List.find(function (err, lists) {
    if(err) { return handleError(res, err); }
    return res.json(200, lists);
  });
};

exports.groupLists = function (req, res) {
  console.log(req.user.groups);
  List.find({groupRestriction: {$in: req.user.groups}})
    .populate('entries.place', 'locationDetails ratings feed')
    .exec(function (err, lists) {
      if(err) { return handleError(res, err); }
      res.json(lists);
    });
};

// Get a single list
exports.show = function(req, res) {
  List.findById(req.params.id)
    .populate('entries.place', 'locationDetails ratings feed')
    .exec(function (err, list) {
      if(err) { return handleError(res, err); }
      if(!list) { return res.send(404); }
      return res.json(list);
    });
};

// Creates a new list in the DB.
exports.create = function(req, res) {
  List.create(req.body, function(err, list) {
    if(err) { return handleError(res, err); }
    return res.json(201, list);
  });
};

// Updates an existing list in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  console.log(req.body);

  // Un-populate
  req.body.entries.forEach(function (entry) {
    if (entry.place && entry.place._id) {
      entry.place = entry.place._id;
    }
  });

  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    list.entries = req.body.entries;
    list.name = req.body.name || list.name;

    list.save(function (err, list) {
      if (err) { return handleError(res, err); }

      var populateOpts = { path: 'entries.place', select: 'locationDetails ratings feed' };
      list.populate(populateOpts, function (err, list) {
        if (err) { return handleError(res, err); }
        return res.json(200, list);
      });
    });
  });
};

exports.addEntry = function (req, res) {
  List.findById(req.params.id, function (err, list) {
    if (err) { return handleError(res, err); }
    if(!list) { return res.send(404); }

    req.body.datetime = moment().toISOString();
    req.body.poster = req.user._id;
    list.entries.push(req.body);
    list.save(function (err, list) {
      if (err) return next(err);
      res.send(list);
    });
  });
};

// Deletes a list from the DB.
exports.destroy = function(req, res) {
  List.findById(req.params.id, function (err, list) {
    if(err) { return handleError(res, err); }
    if(!list) { return res.send(404); }
    list.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

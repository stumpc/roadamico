'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var upload = require('../../components/upload');
var mp = require('../../components/mongoosePromise');

// Get list of approved groups
exports.index = function(req, res) {
  Group.find({approved: true}, function (err, groups) {
    if(err) { return handleError(res, err); }

    // Don't give out the emails
    groups.forEach(function (group) {
      delete group._doc.emails;
    });
    return res.json(200, groups);
  });
};

// Get list of unapproved groups
exports.unapproved = function(req, res) {
  Group.find({approved: false}, function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(200, groups);
  });
};

// Get a single group
exports.show = function(req, res) {
  Group.findOne({_id: req.params.id, administrator: req.user._id}, function (err, group) {
    console.log(err);
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    return res.json(group);
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  req.body.approved = false;
  req.body.administrator = req.user;
  req.body.emails = JSON.parse(req.body.emails).map(function (s) { return s.toLowerCase(); });

  // Upload the verification document
  upload.image(req.files.file)
    .then(function (url) {
      req.body.userVerificationUrl = url;
      return mp.wrapCall(function (f) { Group.create(req.body, f); });
    })
    .then(function (group) {
      res.json(201, group);
    })
    .catch(function (err) {
      handleError(res, err);
    });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  delete req.body._id;
  Group.findOne({_id: req.params.id, administrator: req.user._id}, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findOne({_id: req.params.id, administrator: req.user._id}, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

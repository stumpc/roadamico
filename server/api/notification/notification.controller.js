'use strict';

var _ = require('lodash');
var Notification = require('./notification.model');

// Get list of notifications
exports.index = function(req, res) {
  Notification.find({user: req.user._id}, function (err, notifications) {
    if(err) { return handleError(res, err); }
    return res.json(200, notifications);
  });
};

// Mark a notification as read
exports.mark = function(req, res) {
  Notification.findOne({_id: req.params.id, user: req.user._id}, function (err, notification) {
    if(err) { return handleError(res, err); }
    if(!notification) { return res.send(404); }
    notification.read = true;
    notification.save(function (err, notification) {
      if (err) { return handleError(res, err); }
      return res.json(notification);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

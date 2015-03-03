'use strict';

var _ = require('lodash');
var Booking = require('./booking.model');

// Get list of bookings
exports.index = function(req, res) {
  Booking.find(function (err, bookings) {
    if(err) { return handleError(res, err); }
    return res.json(200, bookings);
  });
};

// Get a single booking
exports.show = function(req, res) {
  Booking.findById(req.params.id, function (err, booking) {
    if(err) { return handleError(res, err); }
    if(!booking) { return res.send(404); }
    return res.json(booking);
  });
};

// Creates a new booking in the DB.
exports.create = function(req, res) {
  Booking.create(req.body, function(err, booking) {
    if(err) { return handleError(res, err); }
    return res.json(201, booking);
  });
};

// Updates an existing booking in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Booking.findById(req.params.id, function (err, booking) {
    if (err) { return handleError(res, err); }
    if(!booking) { return res.send(404); }
    var updated = _.merge(booking, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, booking);
    });
  });
};

// Deletes a booking from the DB.
exports.destroy = function(req, res) {
  Booking.findById(req.params.id, function (err, booking) {
    if(err) { return handleError(res, err); }
    if(!booking) { return res.send(404); }
    booking.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Booking = require('./booking.model');

exports.register = function(socket) {
  Booking.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Booking.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('booking:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('booking:remove', doc);
}
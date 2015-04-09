/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Availability = require('./availability.model.js');

exports.register = function(socket) {
  Availability.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Availability.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('availability:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('availability:remove', doc);
}

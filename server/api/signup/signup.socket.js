/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Signup = require('./signup.model');

exports.register = function(socket) {
  Signup.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Signup.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('signup:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('signup:remove', doc);
}
/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');
var auth = require('../../auth/auth.service');

function populate(doc, cb) {
  if (doc.to._id) { return cb(doc); }   // Already populated
  if (doc.notification) {               // Populate the to
    Message.populate(doc, {path: 'to', select: 'name photo'}, function (err, message) {
      if (!err) cb(message);
    });
  } else {                              // Populate the to and from
    Message.populate(doc, [
      {path: 'to', select: 'name photo'},
      {path: 'from', select: 'name photo'}
    ], function (err, message) {
      if (!err) cb(message);
    });
  }
}

function isValid(doc, userId) {
  if (doc.notification) {
    return doc.to._id.equals(userId);
  } else {
    return doc.to._id.equals(userId) || doc.from._id.equals(userId);
  }
}

exports.register = function(socket) {
  Message.schema.post('save', function (doc) {
    populate(doc, function (message) {
      if (isValid(doc, socket.decoded_token._id)) {
        onSave(socket, message);
      }
    });
  });
  Message.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('message:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('message:remove', doc);
}

/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');
var auth = require('../../auth/auth.service');

exports.register = function(socket) {
  Message.schema.post('save', function (doc) {
    // Only sync messages to clients who are involved with that message
    if (doc.to._id) {

      // The fields have already been populated
      if (doc.to._id.equals(socket.decoded_token._id) || doc.to._id.equals(socket.decoded_token._id)) {
        onSave(socket, doc);
      }
    } else {

      // Fields have not been populated
      if (doc.to.equals(socket.decoded_token._id) || doc.from.equals(socket.decoded_token._id)) {
        Message.populate(doc, [{path: 'to', select: 'name photo'}, {
          path: 'from',
          select: 'name photo'
        }], function (err, message) {
          if (!err) onSave(socket, message);
        });
      }
    }
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

/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');
var auth = require('../../auth/auth.service');

exports.register = function(socket) {
  Message.schema.post('save', function (doc) {
    Message.populate(doc, [{path: 'to', select: 'name photo'}, {path: 'from', select: 'name photo'}], function (err, message) {
      if (!err) onSave(socket, message);
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

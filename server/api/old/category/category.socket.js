/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Category = require('./category.model.js');

exports.register = function(socket) {
  Category.schema.post('save', function (doc) {
    Category.populate(doc, {path: 'parent', select: 'name color icon'}, function (err, category) {
      if (!err) onSave(socket, category);
    });
  });
  Category.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('category:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('category:remove', doc);
}

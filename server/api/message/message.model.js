'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  time: String,
  message: String,
  read: Boolean,
  notification: Boolean
});

module.exports = mongoose.model('Message', MessageSchema);

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  datetime: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  read: Boolean,
  data: {}
});

module.exports = mongoose.model('Notification', NotificationSchema);

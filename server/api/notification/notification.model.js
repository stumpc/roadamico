'use strict';

var email = require('../../components/communication/email');
var User = require('../user/user.model');
var moment = require('moment');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  datetime: {
    type: String, default: function() {
      return moment().toISOString()
    }
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  read: Boolean,
  data: {}
});
NotificationSchema.plugin(require('mongoose-lifecycle'));

var model = mongoose.model('Notification', NotificationSchema);

model.on('afterInsert', function (notification) {

  // Send the user an email
  User.findById(notification.user, function (err, user) {
    if (err || !user) return;
    email(notification.data.name || 'notification', {
      user: user,
      view: {
        datetime: moment(notification.datetime).format('LLLL'),
        user: user,
        data: notification.data
      }
    });
  });
});

module.exports = model;

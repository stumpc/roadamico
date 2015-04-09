'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var communication = require('../../components/communication');
//var User = require('../user/user.model');

var MessageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  time: String,
  message: String,
  read: Boolean,
  notification: Boolean
});


module.exports = mongoose.model('Message', MessageSchema);

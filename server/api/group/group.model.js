'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  term: String,
  location: String,
  locationDetails: {},
  emails: [{type: String, lowercase: true}],
  administrator: { type: Schema.Types.ObjectId, ref: 'User' },
  userVerificationUrl: String,
  approved: Boolean,
  requests: [{
    name: String,
    email: String,
    message: String
  }]
});

module.exports = mongoose.model('Group', GroupSchema);

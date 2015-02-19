'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ServiceSchema = new Schema({
  name: String,
  description: String,
  location: String,
  locationDetails: {},
  provider: { type: Schema.Types.ObjectId, ref: 'User' },
  availability: [{
    datetime: String,
    duration: String,
    notes: String,
    cost: Number,
    booker: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
});

module.exports = mongoose.model('Service', ServiceSchema);

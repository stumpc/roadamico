'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JourneySchema = new Schema({
  name: String,
  destinations: [String],
  html: String
});

module.exports = mongoose.model('Journey', JourneySchema);
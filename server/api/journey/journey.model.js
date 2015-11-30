'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JourneySchema = new Schema({
  name: String,
  html: String,
  destinations: [String]
});

module.exports = mongoose.model('Journey', JourneySchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JourneySchema = new Schema({
  datetime: String,
  name: String,
  html: String
});

module.exports = mongoose.model('Journey', JourneySchema);
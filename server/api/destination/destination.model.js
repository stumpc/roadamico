'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DestinationSchema = new Schema({
  name: String,
  locationDetails: {}
});

module.exports = mongoose.model('Destination', DestinationSchema);

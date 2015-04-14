'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  name: String,
  location: String,
  locationDetails: {},
  description: String,
  photos: [{
    datetime: String,
    url: String,
    poster: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  updates: [{
    datetime: String,
    poster: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    embed: {}
  }],
  reviews: [{
    datetime: String,
    poster: { type: Schema.Types.ObjectId, ref: 'User' },
    score: Number
  }],
  promoted: {
    text: String,
    start: String,
    end: String
  }
});

module.exports = mongoose.model('Place', PlaceSchema);

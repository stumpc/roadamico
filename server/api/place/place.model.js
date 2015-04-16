'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  name: String,
  location: String,
  locationDetails: {},
  phone: String,
  description: String,
  feed: [{
    datetime: String,
    poster: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    embed: {},
    photo: String
  }],
  ratings: [{
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

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
  rater: { type: Schema.Types.ObjectId, ref: 'User' },
  provider: { type: Schema.Types.ObjectId, ref: 'User' },
  booking: { type: Schema.Types.ObjectId, ref: 'Availability' },
  stars: Number,
  comments: String,
  datetime: String
});

module.exports = mongoose.model('Rating', RatingSchema);

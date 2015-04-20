'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: String,
  place: { type: Schema.Types.ObjectId, ref: 'Place' },
  datetime: String,
  meetupTime: String,
  meetupPlace: String,
  canceled: Boolean,
  participants: [{
    datetime: String,
    participant: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  messages: [{
    poster: { type: Schema.Types.ObjectId, ref: 'User' },
    datetime: String,
    text: String
  }],
  creator:  { type: Schema.Types.ObjectId, ref: 'User' },
  groupRestriction: { type: Schema.Types.ObjectId, ref: 'Group' }
});

module.exports = mongoose.model('Event', EventSchema);

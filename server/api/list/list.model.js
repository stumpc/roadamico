'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListSchema = new Schema({
  name: String,
  curated: Boolean,
  entries: [{
    datetime: String,
    text: String,
    embed: {},
    place: { type: Schema.Types.ObjectId, ref: 'Place' },
    poster: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
});

module.exports = mongoose.model('List', ListSchema);

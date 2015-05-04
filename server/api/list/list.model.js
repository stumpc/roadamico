'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListSchema = new Schema({
  name: String,
  entries: [{
    datetime: String,
    text: String,
    photo: String,
    embed: {},
    place: { type: Schema.Types.ObjectId, ref: 'Place' },
    poster: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  tags: [{type: String}],

  curated: Boolean, // Deprecated

  groupRestriction: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  open: Boolean
});

module.exports = mongoose.model('List', ListSchema);

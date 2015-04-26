'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListSchema = new Schema({
  name: String,
  curated: Boolean, // true means it's curated (admins/curators only can edit)
  entries: [{
    datetime: String,
    text: String,
    photo: String,
    embed: {},
    place: { type: Schema.Types.ObjectId, ref: 'Place' },
    poster: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  groupRestriction: { type: Schema.Types.ObjectId, ref: 'Group' }
});

module.exports = mongoose.model('List', ListSchema);

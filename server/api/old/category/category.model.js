'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  aliases: [],
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  color: String,
  icon: String
});

module.exports = mongoose.model('Category', CategorySchema);

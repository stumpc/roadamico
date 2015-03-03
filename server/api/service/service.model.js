'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ServiceSchema = new Schema({
  name: String,
  description: String,
  location: String,
  locationDetails: {},
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  //cost: String,
  details: [{
    cost: String,
    product: String
  }],

  provider: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Service', ServiceSchema);

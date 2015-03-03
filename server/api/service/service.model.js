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

  provider: { type: Schema.Types.ObjectId, ref: 'User' },
  availability: [{
    datetime: String,
    duration: String,
    notes: String,
    cost: Number,
    currency: String,
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' } // Put it in a separate object so people can see details
  }]
});

module.exports = mongoose.model('Service', ServiceSchema);

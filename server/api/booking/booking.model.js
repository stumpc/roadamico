'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookingSchema = new Schema({
  booker: { type: Schema.Types.ObjectId, ref: 'User' },
  updates: [{
    time: String,
    status: String
  }]
});

module.exports = mongoose.model('Booking', BookingSchema);

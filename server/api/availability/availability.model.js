'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
  An availability is separate from a service, rather than an embedded document, because I don't want a service object to
  be constantly updated and get huge because of all the availability entries in it. The client will be getting all the
  services and it should be as small as possible.

  Also, Mongoose doesn't deeply populate. So if a service referenced an availability we could populate its fields, but
  we wouldn't be able to populate the booking's fields.
 */
var AvailabilitySchema = new Schema({
  datetime: String,
  timestamp: Number,
  duration: String,
  notes: String,
  cost: Number,
  currency: String,
  service: { type: Schema.Types.ObjectId, ref: 'Service' },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking' }  // Put it in a separate object so people can't see details
});

module.exports = mongoose.model('Availability', AvailabilitySchema);

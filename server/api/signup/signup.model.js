'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SignupSchema = new Schema({
  email: { type: String, lowercase: true },
  refer: { type: String, lowercase: true },
  date: String
});

module.exports = mongoose.model('Signup', SignupSchema);

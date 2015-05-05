'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../user/user.model');
var _ = require('lodash');

var GroupSchema = new Schema({
  name: String,
  term: String,
  location: String,
  locationDetails: {},
  emails: [{type: String, lowercase: true}],
  administrator: { type: Schema.Types.ObjectId, ref: 'User' },
  userVerificationUrl: String,
  approved: Boolean,
  requests: [{
    name: String,
    email: String,
    message: String
  }]
});

GroupSchema.pre('remove', function(next) {

  var _this = this;
  User.find({groups: this._id}, function (err, users) {
    if (err) {
      console.error(err);
      return next(err);
    }

    users.forEach(function (user) {
      var idx = _.findIndex(user.groups, function (group) {
        return group.equals(_this._id);
      });
      user.groups.splice(idx, 1);
      user.save();
    });

    next();
  });
});

module.exports = mongoose.model('Group', GroupSchema);

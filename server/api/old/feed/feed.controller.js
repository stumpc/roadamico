var Q = require('q');
var _ = require('lodash');
var User = require('../user/user.model');
var Service = require('../service/service.model');
var Availability = require('../availability/availability.model');
var Rating = require('../rating/rating.model');
var moment = require('moment');
var mp = require('../../components/mongoosePromise');


function getFeed(user) {
  var deferred = Q.defer();

  var services;
  var availabilities;
  mp.wrap(Service.find({provider: user._id}))
    .then(function (_services) {
      services = _services;
      var ids = _.map(services, '_id');
      return mp.wrap(Availability.find({service: {$in: ids}, timestamp: { $gte: moment().valueOf() }}));
    })
    .then(function (_availabilities) {
      availabilities = _.filter(_availabilities, function (availability) {
        return !(availability.booking && availability.booking.booker);
      });
      return mp.wrap(Rating.find({provider: user._id}));
    })
    .then(function (ratings) {
      deferred.resolve({
        services: services,
        availabilities: availabilities,
        ratings: ratings
      });
    });

  return deferred.promise;
}

exports.feed = function (req, res, next) {
  var ids = _.map(req.user.following, 'provider');
  User.find({_id: {$in: ids}}, function (err, users) {

    // Get the followed users' profile
    var profiles = _.map(users, 'profile');

    // Generate a feed (consisting of availabilities? and ...?)
    Q.all(users.map(getFeed)).then(function (feeds) {
      var combined = _.zip(profiles, feeds).map(function (data) {
        return {
          profile: data[0],
          feed: data[1]
        };
      });

      res.json(200, combined);
    }).catch(function (err) {
      next(err);
    });

  });
};

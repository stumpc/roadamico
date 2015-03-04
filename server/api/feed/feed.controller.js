var Q = require('q');
var _ = require('lodash');
var User = require('../user/user.model');
var Service = require('../service/service.model');
var Availability = require('../availability/availability.model');
var moment = require('moment');


function getFeed(user) {
  var deferred = Q.defer();

  Service.find({provider: user._id}, function (err, services) {
    if (err) return deferred.reject(err);
    if (!services.length) return deferred.resolve([]);

    // Get the availabilities
    var ids = _.map(services, '_id');
    Availability.find({service: {$in: ids}, timestamp: { $gte: moment().valueOf() }}, function (err, availabilities) {
      if (err) return deferred.reject(err);

      var m = _.groupBy(availabilities, 'service');
      services.forEach(function (service) {
        service._doc.availabilities = m[service._id];
      });
      deferred.resolve(services);
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

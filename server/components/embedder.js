/**
 * Created by josh on 4/15/15.
 */
var embedly = require('embedly');
var Q = require('q');
var config = require('../config/environment');

module.exports = function (url) {
  var deferred = Q.defer();

  if (process.env.NODE_ENV === 'test') {
    deferred.resolve({
      name: 'embedded obj',
      url: url
    });
  } else {
    // Embedly API: https://github.com/embedly/embedly-node
    new embedly({key: config.embedly.key}, function (err, api) {
      if (err) {
        return deferred.reject(err);
      }
      api.oembed({url: url}, function (err, obj) {
        if (err) {
          return deferred.reject(err);
        }
        deferred.resolve(obj);
      });
    });
  }

  return deferred.promise;
};

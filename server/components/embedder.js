/**
 * Created by josh on 4/15/15.
 */
//var embedly = require('embedly');
var embedly = require('./embedly');
var Q = require('q');
var config = require('../config/environment');

module.exports = function (url) {
  var deferred = Q.defer();

  if (process.env.NODE_ENV === 'test') {
    deferred.resolve({
      title: 'embedded obj',
      type: 'test obj',
      url: url,
      thumbnail_url: url
    });
  } else {
    // Embedly API: https://github.com/embedly/embedly-node
      //console.log('KEY: '+ config.embedly.key);
    new embedly({key: config.embedly.key}, function (err, api) {
      if (err) {
        return deferred.reject(err);
      }

      api.oembed({url: url}, function (err, obj) {
        if (err) {
          return deferred.reject(err);
        }
        deferred.resolve(obj[0]);
      });
    });
  }

  return deferred.promise;
};

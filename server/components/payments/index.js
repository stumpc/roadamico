
var Q = require('q');

module.exports = {
  create: function (data) {
    var deferred = Q.defer();

    // TODO: Actually make a payment
    deferred.resolve({});
    return deferred.promise;
  },
  cancel: function (data) {
    var deferred = Q.defer();

    // TODO: Actually cancel the payment taking a percentage
    deferred.resolve({});
    return deferred.promise;
  }
};

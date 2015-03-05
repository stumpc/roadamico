
var Q = require('q');

/**
 * Wraps a Mongoose query or model action in a promise
 * @param query
 * @param action
 * @returns {webdriver.promise.}
 */
exports.wrap = function wrap(query, action) {
  var deferred = Q.defer();

  if (action) {

    // Could be a model action
    query[action](function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(data);
      }
    });
  } else {

    // Execute the query
    query.exec(function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(data);
      }
    });
  }

  return deferred.promise;
};

/*
  Mongoose promise
  By Joshua Monson
  --- --- --- ---

  Allows us to wrap all mongoose calls in a standard promise.
 */

var Q = require('q');

function handleResponse(deferred) {
  return function (err, data) {
    // Turn spread results into an array. Using a loop instead of slice. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
      if (typeof arguments[i] === 'object') {
        args.push(arguments[i]);
      }
    }

    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(args.length === 1 ? data : args);
    }
  };
}

/**
 * Wraps a Mongoose query or model action in a promise
 * @param query
 * @param action
 * @returns {webdriver.promise.}
 */
exports.wrap = function wrap(query, action) {
  var deferred = Q.defer();
  if (action) { // Could be a model action
    query[action](handleResponse(deferred));
  } else { // Execute the query
    query.exec(handleResponse(deferred));
  }
  return deferred.promise;
};

/**
 * Wraps a immediately invoked call in a promise by providing the callback function.
 *
 * Example:
 * mp.wrapCall(function (cb) { MyModel.create(data, cb); })
 *
 * @param f
 * @returns {Promise.promise|*}
 */
exports.wrapCall = function (f) {
  var deferred = Q.defer();
  f(handleResponse(deferred));
  return deferred.promise;
};

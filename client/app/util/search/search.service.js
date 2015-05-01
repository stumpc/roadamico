'use strict';

angular.module('roadAmicoApp')
  .factory('Search', function ($http, $q) {
    var lastQuery;
    var results = {};
    var numSearches = 0;

    return {
      newSearch: function (query) {
        var deferred = $q.defer();
        numSearches++;
        if (numSearches >= 5) {
          results = {}; // Clear search results every 5 searches so we don't hog memory
        }

        $http.post('/api/search', {query: query})
          .success(function (result) {
            lastQuery = query;
            results[query] = result.results;
            deferred.resolve(result.results);
          });

        return deferred.promise;
      },
      getResults: function (query) {
        return results[query || lastQuery];
      },
      getQuery: function () {
        return lastQuery;
      }
    };
  });

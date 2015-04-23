'use strict';

angular.module('roadAmicoApp')
  .factory('placeUtil', function () {

    function average (nums) {
      return Math.round(nums.reduce(function (a, b) { return a + b; }, 0) / nums.length);
    }

    return {
      getPhoto: function (place) {
        var entry = _.find(place.feed, function (entry) {
          return !!(entry.photo || (entry.embed && entry.embed.length && entry.embed[0].thumbnail_url));
        });
        if (entry) {
          return entry.photo || (entry.embed && entry.embed.length && entry.embed[0].thumbnail_url);
        } else {
          return '/assets/images/place_placeholder.jpg';
        }
      },
      getRating: function (place) {
        return average(_.pluck(place.ratings, 'score'));
      }
    };

  });

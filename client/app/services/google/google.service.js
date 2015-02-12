'use strict';

angular.module('roadAmicoApp')
  .factory('Google', function ($window) {

    function Geocoder() {}
    Geocoder.prototype.geocode = angular.noop;

    /**
     * This just checks to see if the google api is available and returns it. Otherwise it returns a mock. This is
     * needed for testing.
     */
    return function () {
      if ($window.google) {
        return $window.google;
      } else {
        return {
          maps: {
            Geocoder: Geocoder
          }
        };
      }
    }
  });

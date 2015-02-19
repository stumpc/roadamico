'use strict';

/**
 * This module is just to make the google namespace, which is registered by the google maps script, injectable.
 * This just checks to see if the google api is available and returns it. Otherwise it returns a mock. This is
 * needed for testing.
 */
angular.module('roadAmicoApp')
  .factory('Google', function ($window) {

    function Geocoder() {}
    Geocoder.prototype.geocode = angular.noop;

    if ($window.google) {
      return $window.google;
    } else {
      return {
        maps: {
          Geocoder: Geocoder
        }
      };
    }
  });

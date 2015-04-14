'use strict';

angular.module('roadAmicoApp')
  .factory('Geolocator', function ($q, Google) {

    function getLatLng(geometry) {
      var lat = geometry.location.k;
      var lng = geometry.location.D;
      return new Google.maps.LatLng(lat, lng);
    }

    return function (object) {
      var deferred = $q.defer();

      // First check for location details
      if (object.locationDetails && object.locationDetails.geometry) {
        deferred.resolve(getLatLng(object.locationDetails.geometry));
      } else if (object.location) {

        // Begin geocoding the address
        var geocoder = new Google.maps.Geocoder();
        geocoder.geocode({address: object.location}, function (results, status) {
          if (status === Google.maps.GeocoderStatus.OK && results.length) {
            deferred.resolve(getLatLng(results[0].geometry));
          } else {
            deferred.reject({message: 'Unable to look up address'});
          }
        });

      } else {
        deferred.reject({message: 'No location'});
      }

      return deferred.promise;
    };

  });

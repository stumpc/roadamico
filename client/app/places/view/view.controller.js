'use strict';

angular.module('roadAmicoApp')
  .controller('ViewPlaceCtrl', function ($scope, $q, $window, $location, $document, place, Modal, Google, Geolocator) {
    $document[0].title = 'RoadAmico - ' + place.name;

    $scope.place = place;

    $scope.viewPhoto = function (photo) {
      Modal.info.image('', photo.url, '');
    };



    // Code for loading the map location

    // Map async loader
    var mapLoader = (function () {
      var deferred = $q.defer();
      $scope.$on('mapInitialized', function(event, map) {
        deferred.resolve(map);
      });
      return deferred.promise;
    }());

    // Set the map center and marker
    Geolocator(place).then(function (pos) {
      mapLoader.then(function (map) {
        map.setCenter(pos);
        new Google.maps.Marker({
          position: pos,
          map: map,
          title: place.location
        });
      });
    });


    // Disqus data
    $scope.disqus = {
      id: 'place:' + place._id,
      url: $location.absUrl()
    };

  });

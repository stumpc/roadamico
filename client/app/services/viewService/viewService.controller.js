'use strict';

angular.module('roadAmicoApp')
  .controller('ViewserviceCtrl', function ($scope, $stateParams, $q, Auth, Service, Google, Geolocator, Availability) {
    $scope.service = Service.get({id: $stateParams.id});
    $scope.user = Auth.getCurrentUser();

    $scope.service.$promise.then(function () {
      $scope.availabilities = Availability.getUpcoming({serviceId: $scope.service._id});
    });

    // Map async loader
    var mapLoader = (function () {
      var deferred = $q.defer();
      $scope.$on('mapInitialized', function(event, map) {
        deferred.resolve(map);
      });
      return deferred.promise;
    }());

    // Set the map center and marker
    $scope.service.$promise.then(Geolocator).then(function (pos) {
      mapLoader.then(function (map) {
        map.setCenter(pos);
        new Google.maps.Marker({
          position: pos,
          map: map,
          title: $scope.service.location
        });
      });
    });
  });

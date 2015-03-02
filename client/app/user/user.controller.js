'use strict';

angular.module('roadAmicoApp')
  .controller('UserCtrl', function ($scope, $stateParams, $state, $q, User, Google, Geolocator, Service, MessageModal) {

    $scope.user = User.get({id: $stateParams.userId});
    $scope.joined = $scope.user.joined || moment('02-14-2015').toISOString();

    // Leave this page if given an invalid user ID
    $scope.user.$promise.then(function () {
      $scope.services = Service.listByProvider({ id: $scope.user._id });
    }).catch(function () {
      $state.go('home');
    });


    $scope.message = MessageModal;


    $scope.map = {
      //center: [0,0]
    };

    // Map async loader
    var mapLoader = (function () {
      var deferred = $q.defer();
      $scope.$on('mapInitialized', function(event, map) {
        deferred.resolve(map);
      });
      return deferred.promise;
    }());

    // Set the map center and marker
    $scope.user.$promise.then(Geolocator).then(function (pos) {
      mapLoader.then(function (map) {
        map.setCenter(pos);
        new Google.maps.Marker({
          position: pos,
          map: map,
          title: $scope.user.location
        });
      });
    });
  });

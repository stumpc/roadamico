'use strict';

angular.module('roadAmicoApp')
  .controller('UserCtrl', function ($scope, $stateParams, $state, User, Google) {

    $scope.user = User.get({id: $stateParams.userId});
    $scope.joined = moment($scope.user.joined || '2015-02-14').format('MMMM D, YYYY');

    // Leave this page if given an invalid user ID
    $scope.user.$promise.then(angular.noop, function (err) {
      $state.go('^');
    });

    $scope.map = {
      //center: [0,0]
    };




    // Map Async stuff

    var map;
    var mapLoadCB = [];
    $scope.$on('mapInitialized', function(event, _map) {
      //map.setCenter( .... )
      //console.log('map inited');
      map = _map;
      angular.forEach(mapLoadCB, function (cb) { cb(); })
    });

    function withMap(f) {
      if (map) {
        f();
      } else {
        mapLoadCB.push(f);
      }
    }

    // Begin geocoding the address
    var geocoder = new Google().maps.Geocoder();
    $scope.user.$promise.then(function () {
      if ($scope.user.location) {
        geocoder.geocode({address: $scope.user.location}, function (results, status) {
          if (status == Google().maps.GeocoderStatus.OK && results.length) {

            var pos = new Google().maps.LatLng(results[0].geometry.location.k, results[0].geometry.location.D);
            withMap(function () {
              map.setCenter(pos);

              new Google().maps.Marker({
                position: pos,
                map: map,
                title: $scope.user.location
              });
            });
          } else {
            console.log('Unable to look up address');
          }
        });
      }
    });
  });

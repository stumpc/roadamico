'use strict';

angular.module('roadAmicoApp')
  .controller('PlacesCtrl', function ($scope, Place, Auth, placeUtil) {
    $scope.places = Place.query();
    $scope.places.$promise.then(function () {
      _.forEach($scope.places, function (result) {
        result.rating = placeUtil.getRating(result);
        result.photo = placeUtil.getPhoto(result);
      });
    });

    $scope.isLoggedIn = Auth.isLoggedIn;
  });

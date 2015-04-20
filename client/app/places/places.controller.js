'use strict';

angular.module('roadAmicoApp')
  .controller('PlacesCtrl', function ($scope, Place, Auth) {
    $scope.places = Place.query();
    $scope.isLoggedIn = Auth.isLoggedIn;
  });

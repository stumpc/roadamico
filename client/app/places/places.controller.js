'use strict';

angular.module('roadAmicoApp')
  .controller('PlacesCtrl', function ($scope, Place) {
    $scope.places = Place.query();
  });

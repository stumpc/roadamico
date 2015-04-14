'use strict';

angular.module('roadAmicoApp')
  .controller('EditPlaceCtrl', function ($scope, $state, place) {
    $scope.place = place;
    $scope.save = function (updated) {
      angular.copy(updated, place);
      place.$update().then(function () {
        $state.go('^.view');
      });
    }
  });

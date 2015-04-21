'use strict';

angular.module('roadAmicoApp')
  .controller('EventEditCtrl', function ($scope, $state, event, place) {
    $scope.event = event;
    $scope.place = place;

    $scope.save = function (updated) {
      angular.copy(updated, event);
      event.$update().then(function () {
        $state.go('^.view');
      });
    };
  });

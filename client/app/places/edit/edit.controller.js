'use strict';

angular.module('roadAmicoApp')
  .controller('EditPlaceCtrl', function ($scope, $state, $document, place) {
    $document[0].title = 'RoadAmico - Editing: ' + place.name;

    $scope.place = place;
    $scope.save = function (updated) {
      angular.copy(updated, place);
      place.$update().then(function () {
        $state.go('^.view');
      });
    }
  });

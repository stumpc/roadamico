'use strict';

angular.module('roadAmicoApp')
  .controller('CreateEventCtrl', function ($scope, $state, place, Event) {
    $scope.place = place;
    $scope.event = {
      datetime: moment().add(1, 'hour').toDate()
    };

    $scope.save = function (event) {
      event.place = place._id;
      Event.save(event).$promise.then(function (event) {
        $state.go('^.event.view', {eid: event._id});
      });
    };
  });

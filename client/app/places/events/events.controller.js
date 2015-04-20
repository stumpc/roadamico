'use strict';

angular.module('roadAmicoApp')
  .controller('EventsCtrl', function ($scope, place, events, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.message = 'Hello';
    $scope.place = place;
    $scope.events = _(events)
      .forEach(function (event) { // Add in usable time data
        event.moment = moment(event.datetime);
        event.when = event.moment.format('llll');
      })
      .filter(function (event) { // Only show future events
        return event.moment > moment();
      })
      .sortBy('moment').value(); // Sorted by time
  });

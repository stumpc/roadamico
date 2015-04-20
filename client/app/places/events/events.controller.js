'use strict';

angular.module('roadAmicoApp')
  .controller('EventsCtrl', function ($scope, place, events, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.user = Auth.getCurrentUser();
    $scope.message = 'Hello';
    $scope.place = place;

    $scope.events = _(events)
      .forEach(function (event) { // Add in usable time data
        event.moment = moment(event.datetime);
        event.when = event.moment.format('llll');
        event.date = event.moment.date();
        event.userGoing = _.contains(_.pluck(event.participants, 'participant'), $scope.user._id);
      })
      .filter(function (event) { // Only show future events
        return event.moment > moment();
      })
      .filter(function (event) { // Take out canceled events
        return !event.canceled;
      })
      .sortBy('moment').value();

    $scope.joinEvent = function (event) {
      event.$join().then(function () {
        console.log('Joined!');
        event.moment = moment(event.datetime);
        event.when = event.moment.format('llll');
        event.userGoing = true;
      });
    };
  });

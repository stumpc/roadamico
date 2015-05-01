'use strict';

angular.module('roadAmicoApp')
  .controller('HomeCtrl', function ($scope, Auth, Event, userFeed) {

    $scope.user = Auth.getCurrentUser();

    Event.query().$promise.then(function (events) {
      $scope.events = _(events)
        .forEach(function (event) {
          event.moment = moment(event.datetime);
          event.when = event.moment.format('llll');
        })
        .filter(function (event) {
          return event.moment >= moment() && !event.canceled;
        })
        .sortBy('moment').take(3).value();
    });

    userFeed().then(function (updates) {
      $scope.updates = _.take(updates, 5);
    });


  });

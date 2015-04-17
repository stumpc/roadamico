'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.events', {
        url: '/events',
        templateUrl: 'app/places/events/events.html',
        controller: 'EventsCtrl',
        resolve: {
          events: function (Event, place) {
            return Event.list({id: place._id}).$promise;
          }
        }
      });
  });

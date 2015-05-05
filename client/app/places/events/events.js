'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.events', {
        url: '/events',
        templateUrl: 'app/places/events/events.html',
        controller: 'EventsCtrl',
        resolve: {
          events: function ($q, Event, place, Auth) {
            var deferred = $q.defer();
            Auth.isLoggedInAsync(function (isLoggedIn) {
              if (isLoggedIn) {
                Event.list({id: place._id}).$promise.then(function (events) {
                  deferred.resolve(events);
                });
              } else {
                Event.publicList({id: place._id}).$promise.then(function (events) {
                  deferred.resolve(events);
                });
              }
            });
            return deferred.promise;
          }
        }
      });
  });

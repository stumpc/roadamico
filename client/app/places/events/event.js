'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.event', {
        url: '/event/:eid',
        template: '<ui-view autoscroll="true"></ui-view>',
        abstract: true,
        resolve: {
          event: function ($stateParams, $q, Event, Auth) {
            var deferred = $q.defer();
            Auth.isLoggedInAsync(function (isLoggedIn) {
              if (isLoggedIn) {
                Event.get({id: $stateParams.eid}).$promise.then(function (event) {
                  deferred.resolve(event);
                });
              } else {
                Event.getPublic({id: $stateParams.eid}).$promise.then(function (event) {
                  deferred.resolve(event);
                });
              }
            });
            return deferred.promise;
          }
        }
      });
  });

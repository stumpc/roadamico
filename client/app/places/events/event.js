'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.event', {
        url: '/event/:eid',
        template: '<ui-view autoscroll="true"></ui-view>',
        abstract: true,
        resolve: {
          event: function ($stateParams, Event) {
            return Event.get({id: $stateParams.eid}).$promise;
          }
        }
      });
  });

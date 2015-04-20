'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('event', {
        url: '/event/:id',
        template: '<ui-view autoscroll="true"></ui-view>',
        resolve: {
          event: function ($stateParams, Event) {
            return Event.get({id: $stateParams.id}).$promise;
          }
        }
      });
  });

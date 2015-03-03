'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service.calendar', {
        url: '/:id/calendar',
        abstract: true,
        template: '<div ui-view></div>',
        resolve: {
          service: function (Service, $stateParams) {
            return Service.get({id: $stateParams.id}).$promise;
          }
        }
      });
  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service', {
        url: '/service/:id',
        abstract: true,
        template: '<div ui-view autoscroll="true"></div>',
        resolve: {
          service: function (Service, $stateParams) {
            if ($stateParams.id) {
              return Service.get({id: $stateParams.id}).$promise;
            } else {
              return {};
            }
          }
        }
      });
  });

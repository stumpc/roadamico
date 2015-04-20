'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place', {
        url: '/place/:id',
        template: '<ui-view autoscroll="true"></ui-view>',
        resolve: {
          place: function ($stateParams, Place) {
            return Place.get({id: $stateParams.id}).$promise;
          }
        }
      });
  });

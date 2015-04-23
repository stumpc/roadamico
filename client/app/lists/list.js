'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('list', {
        url: '/lists/:id',
        template: '<ui-view autoscroll="true"></ui-view>',
        abstract: true,
        resolve: {
          list: function ($stateParams, List) {
            return List.get({id: $stateParams.id}).$promise;
          }
        }
      });
  });

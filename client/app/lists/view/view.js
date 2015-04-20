'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('viewList', {
        url: '/lists/:id',
        templateUrl: 'app/lists/view/view.html',
        controller: 'ViewListCtrl',
        resolve: {
          list: function ($stateParams, List) {
            return List.get({id: $stateParams.id}).$promise;
          }
        }
      });
  });

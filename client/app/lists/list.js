'use strict';

angular.module('roadAmicoApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('list', {
        url: '/lists/:id',
        template: '<ui-view autoscroll="true"></ui-view>',
        abstract: true,
        resolve: {
          list: function($stateParams, $q, List, Auth) {
            var deferred = $q.defer();
            Auth.isLoggedInAsync(function(isLoggedIn) {

              List.get({
                id: $stateParams.id
              }).$promise.then(function(list) {
                deferred.resolve(list);
              });
            });
            return deferred.promise;
          }
        }
      });
  });
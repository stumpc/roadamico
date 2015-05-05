'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editGroup', {
        url: '/profile/groups/:id/edit',
        templateUrl: 'app/account/groups/edit/edit.html',
        controller: 'EditGroupCtrl',
        resolve: {
          group: function (Group, $stateParams) {
            return Group.get({id: $stateParams.id}).$promise;
          }
        }
      });
  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'app/admin/users/users.html',
        controller: 'AdminUsersCtrl',
        admin: true
      });
  });

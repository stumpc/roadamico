'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.grantAccess', {
        url: '/admin/grantAccess',
        templateUrl: 'app/admin/grantAccess/grantAccess.html',
        controller: 'GrantaccessCtrl'
      });
  });

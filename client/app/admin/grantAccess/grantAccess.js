'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.grantAccess', {
        url: '/grant-access',
        templateUrl: 'app/admin/grantAccess/grantAccess.html',
        controller: 'GrantaccessCtrl',
        admin: true
      });
  });

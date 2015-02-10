'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.verify', {
        url: '/verify',
        templateUrl: 'app/admin/verify/verify.html',
        controller: 'VerifyCtrl',
        admin: true
      });
  });

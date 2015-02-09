'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('verify', {
        url: '/admin/verify',
        templateUrl: 'app/admin/verify/verify.html',
        controller: 'VerifyCtrl',
        admin: true
      });
  });

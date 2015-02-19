'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('resetPassword', {
        url: '/reset-password/:id/:code',
        templateUrl: 'app/account/resetPassword/resetPassword.html',
        controller: 'ResetpasswordCtrl'
      });
  });

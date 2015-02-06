'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user/:userId',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      });
  });

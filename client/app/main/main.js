'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider, config) {
    $stateProvider
      .state('main', {
        url: config.appLive ? '/' : '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });

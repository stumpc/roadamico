'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider, config) {
    $stateProvider
      .state('landing', {
        url: config.appLive ? '/landing' : '/',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      });
  });

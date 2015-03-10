'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl',
        abstract: true,
        authenticate: true
      });
    $urlRouterProvider.when('/home', '/home/upcoming');
  });

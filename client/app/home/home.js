'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl',
        authenticate: true,
        title: 'RoadAmico - Home'
      });
    //$urlRouterProvider.when('/home', '/home/upcoming');
  });

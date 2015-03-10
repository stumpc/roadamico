'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.upcoming', {
        url: '/upcoming',
        templateUrl: 'app/home/upcoming/upcoming.html',
        controller: 'UpcomingCtrl'
      });
  });

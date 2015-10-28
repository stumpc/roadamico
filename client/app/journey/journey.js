'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('journey', {
        url: '/journey',
        templateUrl: 'app/journey/journey.html',
        controller: 'JourneyCtrl'
      });
  });

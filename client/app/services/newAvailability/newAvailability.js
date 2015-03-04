'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service.new-slot', {
        url: '/new-availability',
        templateUrl: 'app/services/newAvailability/newAvailability.html',
        controller: 'NewavailabilityCtrl'
      });
  });

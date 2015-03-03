'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service.calendar.new', {
        url: '/new-availability',
        templateUrl: 'app/services/calendar/newAvailability/newAvailability.html',
        controller: 'NewavailabilityCtrl'
      });
  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.createEvent', {
        url: '/events/create',
        templateUrl: 'app/places/events/create/create.html',
        controller: 'CreateEventCtrl'
      });
  });

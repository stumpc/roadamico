'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.event.view', {
        url: '/view',
        templateUrl: 'app/places/events/view/view.html',
        controller: 'EventViewCtrl'
      });
  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.event.edit', {
        url: '/edit',
        templateUrl: 'app/places/events/edit/edit.html',
        controller: 'EventEditCtrl'
      });
  });

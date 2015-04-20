'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.edit', {
        url: '/edit',
        templateUrl: 'app/places/edit/edit.html',
        controller: 'EditPlaceCtrl'
      });
  });

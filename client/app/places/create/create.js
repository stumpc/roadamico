'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('createPlace', {
        url: '/places/create',
        templateUrl: 'app/places/create/create.html',
        controller: 'CreatePlaceCtrl'
      });
  });

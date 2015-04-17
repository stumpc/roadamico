'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('create', {
        url: '/places/create',
        templateUrl: 'app/places/create/create.html',
        controller: 'CreateCtrl'
      });
  });
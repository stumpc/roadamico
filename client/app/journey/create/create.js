'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('create', {
        url: '/journey/create',
        templateUrl: 'app/journey/create/create.html',
        controller: 'CreateCtrl'
      });
  });

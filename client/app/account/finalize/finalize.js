'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('finalize', {
        url: '/finalize',
        templateUrl: 'app/account/finalize/finalize.html',
        controller: 'FinalizeCtrl'
      });
  });
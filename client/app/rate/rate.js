'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('rate', {
        url: '/rate/:id',
        templateUrl: 'app/rate/rate.html',
        controller: 'RateCtrl',
        authenticated: true
      });
  });

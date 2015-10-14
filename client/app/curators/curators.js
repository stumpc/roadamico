'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('curators', {
        url: '/curators',
        templateUrl: 'app/curators/curators.html',
        controller: 'CuratorsCtrl'
      });
  });
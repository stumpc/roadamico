'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stream', {
        url: '/stream/:id',
        templateUrl: 'app/stream/stream.html',
        controller: 'StreamCtrl'
      });
  });
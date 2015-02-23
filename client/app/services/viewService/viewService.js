'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service.view', {
        url: '/view/:id',
        templateUrl: 'app/services/viewService/viewService.html',
        controller: 'ViewserviceCtrl'
      });
  });

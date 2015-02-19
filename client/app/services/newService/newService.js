'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newService', {
        url: '/service/new',
        templateUrl: 'app/services/newService/newService.html',
        controller: 'NewserviceCtrl'
      });
  });
'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service.edit', {
        url: '/edit',
        templateUrl: 'app/services/editService/editService.html',
        controller: 'EditserviceCtrl'
      });
  });

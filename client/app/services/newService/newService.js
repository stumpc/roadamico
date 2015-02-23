'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service.new', {
        url: '/new',
        templateUrl: 'app/services/newService/newService.html',
        controller: 'NewserviceCtrl'
      });
  });

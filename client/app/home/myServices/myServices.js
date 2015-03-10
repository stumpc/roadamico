'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.myServices', {
        url: '/my-services',
        templateUrl: 'app/home/myServices/myServices.html',
        controller: 'MyservicesCtrl'
      });
  });

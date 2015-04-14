'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('view', {
        url: '/lists/:id',
        templateUrl: 'app/lists/view/view.html',
        controller: 'ViewCtrl'
      });
  });
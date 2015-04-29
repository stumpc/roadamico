'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('createList', {
        url: '/lists/create',
        templateUrl: 'app/lists/create/create.html',
        controller: 'CreateListCtrl'
      });
  });

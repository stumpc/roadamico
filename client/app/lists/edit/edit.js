'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('list.edit', {
        url: '/edit',
        templateUrl: 'app/lists/edit/edit.html',
        controller: 'EditListCtrl'
      });
  });

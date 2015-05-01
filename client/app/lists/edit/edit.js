'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('list.settings', {
        url: '/settings',
        templateUrl: 'app/lists/edit/edit.html',
        controller: 'EditListCtrl'
      });
  });

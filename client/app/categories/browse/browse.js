'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('categories.browseRoot', {
        url: '/browse',
        templateUrl: 'app/categories/browse/browse.html',
        controller: 'BrowseCtrl'
      })
      .state('categories.browse', {
        url: '/browse/:parent',
        templateUrl: 'app/categories/browse/browse.html',
        controller: 'BrowseCtrl'
      });
  });

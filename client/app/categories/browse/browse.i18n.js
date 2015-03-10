'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      browse: {
        title: 'Find Services',
        subcategories: 'Sub-categories'
      }
    });
  });

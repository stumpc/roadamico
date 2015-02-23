'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service', {
        url: '/service',
        abstract: true,
        template: '<div ui-view></div>'
      });
  });

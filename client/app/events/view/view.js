'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('event.view', {
        url: '/view',
        templateUrl: 'app/events/view/view.html',
        controller: 'EventViewCtrl'
      });
  });

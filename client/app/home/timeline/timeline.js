'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home.timeline', {
        url: '/history',
        templateUrl: 'app/home/timeline/timeline.html',
        controller: 'TimelineCtrl'
      });
  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('lists', {
        url: '/lists',
        templateUrl: 'app/lists/lists.html',
        controller: 'ListsCtrl',
        title: 'RoadAmico - Explore lists'
      });
  });

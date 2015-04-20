'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('places', {
        url: '/places',
        templateUrl: 'app/places/places.html',
        controller: 'PlacesCtrl',
        title: 'RoadAmico - Explore places'
      });
  });

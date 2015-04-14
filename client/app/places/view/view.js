'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('place.view', {
        url: '/view',
        templateUrl: 'app/places/view/view.html',
        controller: 'ViewPlaceCtrl'
      });
  });

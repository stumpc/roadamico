'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('viewPlace', {
        url: '/places/:id',
        templateUrl: 'app/places/view/view.html',
        controller: 'ViewPlaceCtrl',
        resolve: {
          place: function ($stateParams, Place) {
            console.log($stateParams.id);
            return Place.get({id: $stateParams.id}).$promise;
          }
        }
      });
  });

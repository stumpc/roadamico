'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('service.book', {
        url: '/book/:aId',
        templateUrl: 'app/services/book/book.html',
        controller: 'BookCtrl',
        resolve: {
          availability: function (Availability, $stateParams) {
            return Availability.get({id: $stateParams.aId}).$promise;
          }
        }
      });
  });

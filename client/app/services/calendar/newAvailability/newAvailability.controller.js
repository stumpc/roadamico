'use strict';

angular.module('roadAmicoApp')
  .controller('NewavailabilityCtrl', function ($scope, service) {
    $scope.message = 'Hello';
    $scope.service = service;

    $scope.save = function () {
      console.log($scope.availability);
    };
  });

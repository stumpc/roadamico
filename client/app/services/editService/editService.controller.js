'use strict';

angular.module('roadAmicoApp')
  .controller('EditserviceCtrl', function ($scope, $state, service) {
    $scope.service = service;//Service.get({id: $stateParams.id});

    $scope.save = function () {
      $scope.service.$update(function () {
        $state.go('service.view', {id: $scope.service._id});
      });
    };
  });

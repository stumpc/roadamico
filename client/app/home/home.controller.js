'use strict';

angular.module('roadAmicoApp')
  .controller('HomeCtrl', function ($scope, Auth, Service) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();

    $scope.user.$promise.then(function () {
      $scope.services = Service.listByProvider({id: $scope.user._id});
    });

  });

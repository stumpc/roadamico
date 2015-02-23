'use strict';

angular.module('roadAmicoApp')
  .controller('HomeCtrl', function ($scope, Auth, Service) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();
    $scope.services = Service.listByProvider({id: $scope.user._id})

  });

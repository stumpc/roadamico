'use strict';

angular.module('roadAmicoApp')
  .controller('MyservicesCtrl', function ($scope, Auth, Service) {

    $scope.user = Auth.getCurrentUser();
    $scope.user.$promise.then(function () {
      $scope.services = Service.listByProvider({id: $scope.user._id});
    });

  });

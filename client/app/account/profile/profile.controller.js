'use strict';

angular.module('roadAmicoApp')
  .controller('ProfileCtrl', function ($scope, Auth) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();


    $scope.save = function () {
      $scope.user.$update();
      $scope.userForm.$setPristine();
    };
  });

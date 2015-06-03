'use strict';

angular.module('roadAmicoApp')
  .controller('ListsCtrl', function ($scope, List, Auth, listUtil) {
    $scope.isLoggedIn = Auth.isLoggedIn;

    if (Auth.isLoggedIn()) {
      $scope.lists = List.query();
    } else {
      $scope.lists = List.publicLists();
    }


    $scope.lists.$promise.then(function () {
        _.forEach($scope.lists, function (result) {
            result.rating = listUtil.getRating(result);
        });
    });

  });

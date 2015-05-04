'use strict';

angular.module('roadAmicoApp')
  .controller('ListsCtrl', function ($scope, List, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;

    if (Auth.isLoggedIn()) {
      $scope.lists = List.query();
    } else {
      $scope.lists = List.publicLists();
    }

  });

'use strict';

angular.module('roadAmicoApp')
  .controller('ListsCtrl', function ($scope, List, Auth) {
    $scope.lists = List.query();
    $scope.isLoggedIn = Auth.isLoggedIn;

    if (Auth.isLoggedIn()) {
      $scope.groupLists = List.groupLists();
    }

  });

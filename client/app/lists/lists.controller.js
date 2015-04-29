'use strict';

angular.module('roadAmicoApp')
  .controller('ListsCtrl', function ($scope, List, Group) {
    $scope.lists = List.query();

    $scope.groupLists = List.groupLists();
  });

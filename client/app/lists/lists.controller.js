'use strict';

angular.module('roadAmicoApp')
  .controller('ListsCtrl', function ($scope, List) {
    $scope.lists = List.query();
  });

'use strict';

angular.module('roadAmicoApp')
  .controller('ViewListCtrl', function ($scope, list) {
    $scope.list = list;
  });

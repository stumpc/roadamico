'use strict';

angular.module('roadAmicoApp')
  .controller('EditListCtrl', function ($scope, $state, list) {
    $scope.list = list;

    $scope.save = function (updated) {
      angular.copy(updated, list);
      list.$update().then(function () {
        $state.go('^.view');
      });
    };
  });

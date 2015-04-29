'use strict';

angular.module('roadAmicoApp')
  .controller('CreateListCtrl', function ($scope, $state, List) {
    $scope.create = function (updated) {
      List.save(updated).$promise.then(function (list) {
        $state.go('list.view', {id: list._id});
      });
    };
  });

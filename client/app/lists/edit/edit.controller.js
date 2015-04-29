'use strict';

angular.module('roadAmicoApp')
  .controller('EditListCtrl', function ($scope, $state, list) {
    $scope.list = list;

    $scope.save = function (updated) {
      updated.$update().then(function (_list) {
        angular.copy(_list, list);
        //console.log(_list);
        //console.log(list);
        $state.go('^.view');
      });
    };
  });

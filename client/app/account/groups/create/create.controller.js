'use strict';

angular.module('roadAmicoApp')
  .controller('CreateGroupCtrl', function ($scope, $state, Group) {
    $scope.create = function (updated) {
      Group.save(updated).$promise.then(function () {
        $state.go('profile');
      });
    };
  });

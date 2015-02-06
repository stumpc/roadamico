'use strict';

angular.module('roadAmicoApp')
  .controller('UserCtrl', function ($scope, $stateParams, $state, User) {
    $scope.message = 'Hello';

    $scope.user = User.get({id: $stateParams.userId});
    $scope.user.$promise.then(angular.noop, function (err) {
      $state.go('^');
    });
  });

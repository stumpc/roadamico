'use strict';

angular.module('roadAmicoApp')
  .controller('SearchCtrl', function ($scope, User) {
    $scope.message = 'Hello';

    $scope.users = User.query();
  });

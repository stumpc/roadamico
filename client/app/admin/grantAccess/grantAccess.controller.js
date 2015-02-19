'use strict';

angular.module('roadAmicoApp')
  .controller('GrantaccessCtrl', function ($scope, $resource, $http, Modal) {
    $scope.message = 'Hello';

    $scope.signups = $resource('/api/signups').query();

    $scope.grant = Modal.confirm.yesno(function (signup) {
      $http.post('/api/signups/' + signup._id, {
        email: signup.email
      }).success(function (data) {
        Modal.info.message(data.message);
      }).error(function () {
        Modal.info.message('Error granting access.');
      });
    });
  });

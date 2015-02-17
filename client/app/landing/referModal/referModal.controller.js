'use strict';

angular.module('roadAmicoApp')
  .controller('referModalCtrl', function ($scope, $http, $log, Modal) {



    $scope.signup = function () {
      $http.post('/api/signups', {
        email: $scope.email
      }).success(function () {
        Modal.info.message('Thank you for signing up for RoadAmico. We have saved your email address ' + $scope.email + ' and will contact you when you are granted access.');
      }).error(function (err) {
        $log(err);
      });
    };
  });

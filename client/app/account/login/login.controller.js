'use strict';

angular.module('roadAmicoApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, config, Modal, $http) {
    $scope.config = config;
    $scope.user = {};
    $scope.errors = {};

    $scope.forgot = function () {
      Modal.prompt.email('Please enter your email address and we will send you a link which you can use to reset your password.', function (email) {
        $http.post('/api/users/reset', {
          email: email
        }).success(function () {
          Modal.info.message('An email has been sent to ' + email + ' containing a link to reset your password.');
        }).error(function (err) {
          if (err.message) {
            Modal.info.error('Error sending email', err.message);
          } else {
            Modal.info.error('There was a problem sending the password reset email.');
          }
        });
      });
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/home');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });

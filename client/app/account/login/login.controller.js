'use strict';

angular.module('roadAmicoApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, config, Modal, $http, $translate) {
    $scope.config = config;
    $scope.user = {};
    $scope.errors = {};

    $scope.forgot = function () {
      $translate(['login.reset-password-message', 'login.email-sent', 'login.email-error-title', 'login.email-error']).then(function (translations) {

        Modal.prompt.email(translations['login.reset-password-message'], function (email) {
          $http.post('/api/users/reset', {
            email: email
          }).success(function () {
            Modal.info.message(translations['login.email-sent']);
          }).error(function (err) {
            if (err.message) {
              Modal.info.error(translations['login.email-error-title'], err.message);
            } else {
              Modal.info.error(translations['login.email-error']);
            }
          });
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

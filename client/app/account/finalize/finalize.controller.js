'use strict';

angular.module('roadAmicoApp')
  .controller('FinalizeCtrl', function ($scope, $state, $location, Auth, Modal, timezones, languages, $translate) {

    $scope.timezones = timezones;
    $scope.languages = _.map(languages, function (name, code) {
      return {name: name, code: code};
    });

    // Check for user id in query string to load the user
    var code = $location.search().code;
    if (!Auth.isLoggedIn()) {
      if ($location.search().id && code) {
        Auth.login({
          email: $location.search().id,
          password: code
        }).then(function () {
          $scope.user = Auth.getCurrentUser();
        }).catch(function () {
          $translate('finalize.invalid-user-id').then(Modal.info.error);
        });
      } else {
        $state.go('main');
      }
    } else {
      $scope.user = Auth.getCurrentUser();
    }

    $scope.submitted = false;
    $scope.step = 1;

    $scope.save1 = function () {
      $scope.submitted = true;
      $scope.errors = {};
      $scope.userForm1.email.$setValidity('mongoose', true);

      $scope.user.$update().then(function () {
        $scope.step++;
      }).catch(function (err) {
        err = err.data;
        $scope.errors = {};

        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, function (error, field) {
          $scope.userForm1[field].$setValidity('mongoose', false);
          $scope.errors[field] = error.message;
        });
      });
    };

    $scope.save2 = function () {
      Auth.changePassword(code, $scope.password1).then(function () {
        $state.go('home');
      }, function () {
        $translate('finalize.error-change-pw').then(Modal.info.error);
      });
    };
  });

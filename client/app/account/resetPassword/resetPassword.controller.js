'use strict';

angular.module('roadAmicoApp')
  .controller('ResetpasswordCtrl', function ($scope, $stateParams, $state, $translate, User, Auth, Modal) {

    // Get the user
    $scope.user = User.get({id: $stateParams.id});

    $scope.resetPassword = function () {

      // Login as the user to build the Authorization header
      Auth.login({
        email: $scope.user.email,
        password: $stateParams.code
      }).then(function () {

        // Change the password
        Auth.changePassword($stateParams.code, $scope.password1).then(function () {
          $translate('password-changed').then(Modal.info.message);
          $state.go('profile');
        }).catch(function (err) {
          $translate('reset-password.cant-change').then(Modal.info.error);
          Auth.logout();
          $state.go('main');
        });

      }).catch(function () {
        $translate('reset-password.bad-url').then(Modal.info.error);
        $state.go('main');
      });

    };
  });

'use strict';

angular.module('roadAmicoApp')
  .controller('ResetpasswordCtrl', function ($scope, $stateParams, $state, User, Auth, Modal) {

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
          Modal.info.message('Password changed.');
          $state.go('home');
        }).catch(function (err) {
          Modal.info.error('Couldn\'t change password', err.message);
          Auth.logout();
          $state.go('main');
        });

      }).catch(function () {
        Modal.info.error('Invalid password reset URL');
        $state.go('main');
      });

    };
  });

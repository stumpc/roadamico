'use strict';

angular.module('roadAmicoApp')
  .controller('ProfileCtrl', function ($scope, $upload, $http, $translate, Auth, Modal) {
    $scope.message = 'Hello';
    $scope.user = Auth.getCurrentUser();

    $scope.years = _.range(11).map(function (i) {
      return moment().year() + i;
    });

    $scope.save = function (form) {
      $scope.user.$update();
      form.$setPristine();
    };

    $scope.pwErrors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(function () {
            return $translate('password-changed');
          })
          .then(function(translation) {
            Modal.info.message(translation);
            $scope.user.oldPassword = '';
            $scope.user.newPassword = '';
            $scope.user.newPassword2 = '';
            form.$setPristine();
          })
          .catch(function (response) {
            form.oldPassword.$setValidity('mongoose', false);
            $scope.pwErrors.other = response.data.message;
          });
      }
    };

    $scope.onFileSelect = function (image) {
      $upload.upload({
        url: 'api/users/pic',
        file: image
      }).success(function (data) {
        $scope.user.photo = data;
      });
    };
  });

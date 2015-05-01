'use strict';

angular.module('roadAmicoApp')
  .controller('ProfileCtrl', function ($scope, $upload, $http, $translate, Auth, Modal, Destination, Group) {
    $scope.message = 'Hello';
    $scope.user = Auth.getCurrentUser();

    $scope.destinations = Destination.query();
    $scope.groups = Group.query();

    $scope.groups.$promise.then(function (groups) {
      $scope.terms = _(groups).map('term').uniq().value();
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

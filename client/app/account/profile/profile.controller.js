'use strict';

angular.module('roadAmicoApp')
  .controller('ProfileCtrl', function ($scope, $upload, $http, $translate, Auth, Modal, Category, timezones, languages) {
    $scope.message = 'Hello';
    $scope.user = Auth.getCurrentUser();
    $scope.categories = Category;
    $scope.years = _.range(11).map(function (i) {
      return moment().year() + i;
    });
    $scope.timezones = timezones;
    $scope.languages = _.map(languages, function (name, code) {
      return {name: name, code: code};
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

    $scope.idSelect = function (image) {
      $upload.upload({
        url: 'api/verification',
        file: image
      }).success(function (data) {
        console.log(data);
        $scope.user.verification = data;
      });
    };

    $scope.saveCard = function () {
      function sv(password) {
        $http.post('/api/users/card', {
          password: password,
          card: $scope.newCard
        }).success(function (data) {
          $scope.user.financial = data;
          $scope.addCard = false;
          $scope.newCard = {};
          $scope.newCardForm.$setPristine();
        }).error(function (data) {
          if (data === 'Forbidden') {
            $translate('invalid-password').then(function (translation) {
              Modal.prompt.password(translation, sv);
            });
          } else {
            $translate('profile.card-save-error').then(function (translation) {
              Modal.info.error(translation + ' <strong>' + data.message + '</strong>');
            });
          }
        });
      }
      Modal.prompt.password(sv);
    };

    $scope.deleteCard = Modal.confirm.delete(function (id) {
      $http.delete('/api/users/card/'+id).success(function (data) {
        $scope.user.financial = data;
      }).error(function () {
        $translate('cant-delete-card').then(Modal.info.error);
      });
    });
  });

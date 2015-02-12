'use strict';

angular.module('roadAmicoApp')
  .controller('ProfileCtrl', function ($scope, $upload, $http, Auth, Modal) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();

    $scope.years = [0,1,2,3,4,5,6,7,8,9,10].map(function (i) {
      return moment().year() + i;
    });

    $scope.save = function () {
      $scope.user.$update();
      $scope.userForm.$setPristine();
    };

    $scope.onFileSelect = function (image) {
      $upload.upload({
        url: 'api/users/pic',
        file: image
      }).success(function (data, status, headers, config) {
        $scope.user.photo = data;
      });
    };

    $scope.idSelect = function (image) {
      $upload.upload({
        url: 'api/verification',
        file: image
      }).success(function (data, status, headers, config) {
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
        }).error(function (data) {
          if (data === 'Forbidden') {
            Modal.prompt.password(sv, 'Invalid password');
          } else {
            Modal.info.error('Error', 'There was an error saving your card', data.reason);
          }
        });
      }
      Modal.prompt.password(sv);
    };

    $scope.deleteCard = Modal.confirm.delete(function (id) {
      $http.delete('/api/users/card/'+id).success(function (data) {
        $scope.user.financial = data;
      }).error(function () {
        Modal.info.error('Error', 'Could not delete card');
      });
    });
  });

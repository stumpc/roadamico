'use strict';

angular.module('roadAmicoApp')
  .controller('ProfileCtrl', function ($scope, $upload, $http, Auth, Modal, Category) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();

    $scope.categories = Category;

    $scope.years = _.range(11).map(function (i) {
      return moment().year() + i;
    });

    // TODO: Add in mongoose errors
    $scope.save = function (form) {
      $scope.user.$update();
      form.$setPristine();
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
            Modal.prompt.password('Invalid password', sv);
          } else {
            Modal.info.error('There was an error saving your card. <strong>' + data.reason + '</strong>');
          }
        });
      }
      Modal.prompt.password(sv);
    };

    $scope.deleteCard = Modal.confirm.delete(function (id) {
      $http.delete('/api/users/card/'+id).success(function (data) {
        $scope.user.financial = data;
      }).error(function () {
        Modal.info.error('Could not delete card');
      });
    });
  });

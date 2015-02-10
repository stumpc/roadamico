'use strict';

angular.module('roadAmicoApp')
  .controller('ProfileCtrl', function ($scope, $upload, Auth) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();


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
  });

'use strict';

angular.module('roadAmicoApp')
  .controller('VerifyCtrl', function ($scope, Verification, Modal) {
    $scope.message = 'Hello';

    // Load user info
    $scope.pending = Verification.pending();
    $scope.approved = Verification.approved();
    $scope.denied = Verification.denied();

    // Image viewer
    $scope.viewImg = Modal.info.image;

    // Actions
    $scope.approve = function (user, src) {
      Verification.approve(user._id).then(function () {
        src.splice(src.indexOf(user), 1);
        $scope.approved = Verification.approved();
      }, function () {
        Modal.info.error("Couldn't approve: " + user.name);
      });
    };

    $scope.deny = function (user, src) {
      Verification.deny(user._id).then(function () {
        src.splice(src.indexOf(user), 1);
        $scope.denied = Verification.denied();
      }, function () {
        Modal.info.error("Couldn't deny: " + user.name);
      });
    };


  });

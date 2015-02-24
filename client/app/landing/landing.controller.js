'use strict';

angular.module('roadAmicoApp')
  .controller('LandingCtrl', function ($scope, $http, $log, $modal, $location, Modal) {

    // Check for messages
    if ($location.search().message) {
      Modal.info[$location.search().messageType || 'error']($location.search().message);
    }

    function save(obj) {
      $http.post('/api/signups', obj).success(function () {
        Modal.info.message('Thank you for signing up for RoadAmico. We have saved your email address and will contact you when you are granted access.');
      }).error(function (err) {
        $log.error(err);
      });
    }

    $scope.signup = function () {
      save({
        email: $scope.email
      });
    };

    $scope.refer = function () {
      var referModal = $modal.open({
        templateUrl: 'app/landing/referModal.html'
      });
      referModal.result.then(function (data) {
        save(data);
      });
    };
  });

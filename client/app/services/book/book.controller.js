'use strict';

angular.module('roadAmicoApp')
  .controller('BookCtrl', function ($scope, $state, Modal, Auth, service, availability) {
    $scope.service = service;
    $scope.availability = availability;
    $scope.availability._duration = (function (parts) {
      return moment.duration(Number(parts[0]), parts[1]);
    }($scope.availability.duration.split(/\s/)));

    $scope.user = Auth.getCurrentUser();

    $scope.confirm = function () {
      availability.$book(function () {
        $state.go('service.view', {id: service._id});
        Modal.info.message('Time slot booked');
      }, function (err) {
        Modal.info.error('Error booking slot', err.data.message);
        $state.go('service.view', {id: service._id});
      });
    };
  });

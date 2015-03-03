'use strict';

angular.module('roadAmicoApp')
  .controller('NewavailabilityCtrl', function ($scope, $state, service, Availability, Modal) {
    $scope.message = 'Hello';
    $scope.service = service;
    $scope.availability = {
      service: service,
      datetime: new Date()
    };

    $scope.save = function () {
      Availability.save($scope.availability).$promise.then(function () {
        $state.go('service.view', {id: service._id});
      }).catch(function (err) {
        Modal.info.error(err.message, 'Error creating calendar entry');
        $state.go('service.view', {id: service._id});
      });
    };
  });

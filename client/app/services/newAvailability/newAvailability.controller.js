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
      var promise;
      if ($scope.availability.repeat && $scope.availability.repeat.period) {
        promise = Availability.saveRepeat($scope.availability).$promise;
      } else {
        promise = Availability.save($scope.availability).$promise;
      }
      promise.then(function () {
        $state.go('service.view', {id: service._id});
      }).catch(function (err) {
        Modal.info.error(err.message, 'Error creating calendar entry');
        $state.go('service.view', {id: service._id});
      });
    };
  });

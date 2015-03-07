'use strict';

angular.module('roadAmicoApp')
  .controller('RateCtrl', function ($scope, $stateParams, $state, Modal, Service, Availability, Rating, Auth) {

    $scope.availability = Availability.get({id: $stateParams.id});

    $scope.availability.$promise.then(function (availability) {
      $scope.rating.booking = availability._id;

      $scope.service = Service.get({id: availability.service});
      $scope.service.$promise.then(function (service) {
        $scope.rating.provider = service.provider._id;
      });
    });

    $scope.rating = {
      rater: Auth.getCurrentUser()._id
    };

    $scope.save = function () {
      Rating.save($scope.rating).$promise.then(function () {
        Modal.info.message('Thank you for rating');
        $state.go('service.book', {id: $scope.service._id, aId: $scope.availability._id});
      }).catch(function (err) {
        Modal.info.error('Error saving rating', err.data.message);
        $state.go('service.book', {id: $scope.service._id, aId: $scope.availability._id});
      });
    };

  });

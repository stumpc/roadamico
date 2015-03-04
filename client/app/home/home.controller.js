'use strict';

angular.module('roadAmicoApp')
  .controller('HomeCtrl', function ($scope, $resource, Auth, Service, Availability) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();

    $scope.user.$promise.then(function () {
      $scope.services = Service.listByProvider({id: $scope.user._id});
    });

    $scope.feed = $resource('/api/feed').query();

    // TODO: Only show upcoming bookings
    $scope.bookings = Availability.mine();

  });

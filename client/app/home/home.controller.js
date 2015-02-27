'use strict';

angular.module('roadAmicoApp')
  .controller('HomeCtrl', function ($scope, Auth, sessionCache, socket) {
    $scope.message = 'Hello';

    $scope.user = Auth.getCurrentUser();

    var allServices;
    function selectMine() {
      $scope.services = _.filter(allServices, {provider: {_id: $scope.user._id}});
    }
    $scope.user.$promise
      .then(sessionCache.services(true))
      .then(function (services) {
        allServices = services;
        selectMine();
      })
      .then(function () {
        socket.syncUpdates('service', allServices, selectMine);
      });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('service');
    });

  });

'use strict';

angular.module('roadAmicoApp')
  .controller('SearchCtrl', function ($scope, $http, Service) {
    $scope.message = 'Hello';

    var serviceMap = {};
    Service.query().$promise.then(function (services) {
      angular.forEach(services, function (service) {
        serviceMap[service._id] = service;
      });
    });

    $scope.search = function () {
      // Formulate the query
      var query = {};
      if ($scope.locationDetails) {
        query.position = [$scope.locationDetails.geometry.location.k, $scope.locationDetails.geometry.location.D];
      } else if ($scope.location) {
        query.location = $scope.location;
      }
      query.name = $scope.name;

      $http.post('/api/services/search', query).then(function (result) {
        $scope.searchResults = result.data;
        angular.forEach($scope.searchResults, function (result) {
          result.service = serviceMap[result.id];
        });
      });
    };
  });

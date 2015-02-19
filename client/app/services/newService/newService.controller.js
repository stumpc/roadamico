'use strict';

angular.module('roadAmicoApp')
  .controller('NewserviceCtrl', function ($scope, $state, Service, Category, Modal) {
    $scope.categories = Category;

    $scope.create = function () {
      Service.save($scope.service).$promise.then(function (service) {
        console.log('Service created', service);
        $state.go('home');
      }).catch(function (err) {
        Modal.info.error('Error creating your service', err.message);
        $state.go('home');
      });
    };
  });

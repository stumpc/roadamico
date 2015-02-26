'use strict';

angular.module('roadAmicoApp')
  .controller('BrowseCtrl', function ($scope, $stateParams, categories, Service) {
    $scope.categories = categories;

    $scope.parent = $stateParams.parent;
    if ($scope.parent) {
      $scope.parentCategory = _.find(categories, {_id: $scope.parent});
    }

    $scope.subcategories = _.filter(categories, function (category) {
      return (!$scope.parent && !category.parent) || (category.parent && category.parent._id === $scope.parent);
    });

    $scope.services = Service.listByCategory({id: $stateParams.parent});
  });

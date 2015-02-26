'use strict';

angular.module('roadAmicoApp')
  .controller('EditcategoriesCtrl', function ($scope, $modal, $rootScope, Category, socket, Modal) {

    $scope.categories = Category.query();
    $scope.categories.$promise.then(function () {
      socket.syncUpdates('category', $scope.categories);
    });
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('category');
    });

    $scope.create = function () {
      var modalScope = $rootScope.$new();
      modalScope.categories = angular.copy($scope.categories);
      modalScope.categories.unshift({_id: null, name: 'None'});
      var modal = $modal.open({
        templateUrl: 'app/admin/editCategories/categoryModal.html',
        scope: modalScope,
        size: 'lg'
      });
      modal.result.then(function (data) {
        Category.save(data);
      });
    };

    $scope.edit = function (category) {
      var modalScope = $rootScope.$new();
      modalScope.categories = angular.copy($scope.categories);
      modalScope.categories.unshift({_id: null, name: 'None'});
      modalScope.category = category;
      var modal = $modal.open({
        templateUrl: 'app/admin/editCategories/categoryModal.html',
        scope: modalScope,
        size: 'lg'
      });
      modal.result.then(function (data) {
        Category.update(data);
      });
    };

    function deleteCategory(category) {
      Category.remove({ id: category._id });
    }

    $scope.confirm = Modal.confirm['delete'](deleteCategory);

  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin.categories', {
        url: '/edit-categories',
        templateUrl: 'app/admin/editCategories/editCategories.html',
        controller: 'EditcategoriesCtrl',
        admin: true
      });
  });

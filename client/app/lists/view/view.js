'use strict';

angular.module('roadAmicoApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('list.view', {
        url: '/view',
        templateUrl: 'app/lists/view/view.html',
        controller: 'ViewListCtrl',
        resolve: {
          editing: function() {
            return false;
          }
        }
      })
      .state('list.edit', {
        url: '/edit',
        templateUrl: 'app/lists/view/view.html',
        controller: 'ViewListCtrl',
        resolve: {
          editing: function() {
            return true;
          }
        }
      });
  });
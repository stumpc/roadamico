'use strict';

angular.module('roadAmicoApp')
  .factory('Category', function ($resource) {

    return $resource('/api/categories/:id', {id: '@_id'}, {
      roots: {
        url: '/api/categories/roots',
        method: 'GET',
        isArray: true
      },
      children: {
        url: '/api/categories/:id/children',
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'PUT'
      }
    });

  });

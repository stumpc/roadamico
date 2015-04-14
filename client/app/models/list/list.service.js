'use strict';

angular.module('roadAmicoApp')
  .factory('List', function ($resource) {
    return $resource('/api/lists/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });
  });

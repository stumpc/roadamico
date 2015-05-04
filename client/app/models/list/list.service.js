'use strict';

angular.module('roadAmicoApp')
  .factory('List', function ($resource) {
    return $resource('/api/lists/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      },
      addEntry: {
        method: 'POST',
        url: '/api/lists/:id/entry'
      },
      publicLists: {
        url: '/api/lists/public',
        isArray: true
      }
    });
  });

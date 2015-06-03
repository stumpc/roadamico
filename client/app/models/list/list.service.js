'use strict';

angular.module('roadAmicoApp')
  .factory('List', function ($resource) {
    return $resource('/api/lists/:id', {id: '@_id'}, {
      getPublic: {
        method: 'GET',
        url: '/api/lists/:id/public'
      },
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
      },
      rate: {
        method: 'POST',
        url: '/api/lists/:id/rate'
      }
    });
  });

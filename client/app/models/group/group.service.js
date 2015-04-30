'use strict';

angular.module('roadAmicoApp')
  .factory('Group', function ($resource) {
    return $resource('/api/groups/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      },
      allowed: {
        url: '/api/groups/allowed',
        method: 'GET'
      },
      mine: {
        url: '/api/groups/mine',
        isArray: true
      }
    });
  });

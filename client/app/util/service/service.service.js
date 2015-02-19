'use strict';

angular.module('roadAmicoApp')
  .factory('Service', function ($resource) {

    return $resource('/api/services/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      },
      listByProvider: {
        url: '/api/services/provider/:id',
        isArray: true
      }
    });

  });

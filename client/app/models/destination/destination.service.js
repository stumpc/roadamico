'use strict';

angular.module('roadAmicoApp')
  .factory('Destination', function ($resource) {
    return $resource('/api/destinations/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });
  });

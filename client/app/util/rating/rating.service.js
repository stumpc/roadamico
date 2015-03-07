'use strict';

angular.module('roadAmicoApp')
  .factory('Rating', function ($resource) {
    return $resource('/api/ratings/for/:id', {id: '@provider'}, {
      list: {
        method: 'GET',
        isArray: true
      },
      create: {
        method: 'POST'
      },
      mine: {
        method: 'GET',
        url: '/api/ratings/mine',
        isArray: true
      }
    });
  });

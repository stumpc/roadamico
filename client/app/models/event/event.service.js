'use strict';

angular.module('roadAmicoApp')
  .factory('Event', function ($resource) {
    return $resource('/api/events/:id', {id: '@_id'}, {
      list: {
        url: '/api/events/place/:id',
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'PUT'
      },
      join: {
        url: 'api/events/:id/join',
        method: 'PUT'
      },
      message: {
        url: 'api/events/:id/message',
        method: 'POST'
      }
    });
  });

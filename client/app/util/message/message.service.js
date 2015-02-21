'use strict';

angular.module('roadAmicoApp')
  .factory('Message', function ($resource) {
    return $resource('/api/messages/:id', { id: '@_id' }, {

      mark: {
        url: '/api/messages/read',
        method: 'PUT'
      },
      sent: {
        url: '/api/messages/sent',
        method: 'GET',
        isArray: true
      },
      received: {
        url: '/api/messages/received',
        method: 'GET',
        isArray: true
      }

    });
  });

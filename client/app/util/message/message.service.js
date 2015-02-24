'use strict';

angular.module('roadAmicoApp')
  .factory('Message', function ($resource) {
    return $resource('/api/messages/:id', { id: '@_id' }, {

      mark: {
        url: '/api/messages/:id',
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
      },
      mine: {
        url: '/api/messages/mine',
        method: 'GET',
        isArray: true
      }

    });
  });

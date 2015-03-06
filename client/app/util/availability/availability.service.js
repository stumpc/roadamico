'use strict';

angular.module('roadAmicoApp')
  .factory('Availability', function ($resource) {
    return $resource('/api/availabilities/:id', {id: '@_id'}, {
      saveRepeat: {
        method: 'POST',
        url: '/api/availabilities/repeat',
        isArray: true
      },
      update: {
        method: 'PUT'
      },
      getUpcoming: {
        url: '/api/availabilities/upcoming/:serviceId',
        method: 'GET',
        isArray: true
      },
      getAll: {
        url: '/api/availabilities/all/:serviceId',
        method: 'GET',
        isArray: true
      },
      book: {
        url: '/api/availabilities/:id/book',
        method: 'PUT'
      },
      cancel: {
        url: '/api/availabilities/:id/cancel',
        method: 'PUT'
      },
      mine: {
        url: '/api/availabilities/mine',
        method: 'GET',
        isArray: true
      }
    })
  });

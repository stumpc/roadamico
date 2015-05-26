'use strict';

angular.module('roadAmicoApp')
  .factory('Place', function ($resource) {
    return $resource('/api/places/:id', {id: '@_id'}, {
      update: {
        method: 'PUT'
      },
      rate: {
        method: 'POST',
        url: '/api/places/:id/rate'
      },
      addEntry: {
        method: 'POST',
        url: '/api/places/:id/feed'
      },
      saveFeedPhoto: {
        method: 'POST',
        url: '/api/places/:id/save-feed-photo'
      },
      removePost: {
        method: 'DELETE',
        url: '/api/places/:id/feed/:index'
      }
    });
  });

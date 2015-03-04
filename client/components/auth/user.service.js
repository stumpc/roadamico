'use strict';

angular.module('roadAmicoApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      update: {
        method: 'PUT'
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      profiles: {
        method: 'GET',
        url: '/api/users/profiles',
        isArray: true
      },
      follow: {
        method: 'PUT',
        url: '/api/users/follow'
      },
      unfollow: {
        method: 'PUT',
        url: '/api/users/unfollow'
      }
	  });
  });

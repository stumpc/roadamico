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
      },
      own: {
        url: '/api/groups/own',
        isArray: true
      },
      members: {
        url: '/api/groups/:id/members',
        isArray: true
      },
      removeMember: {
        url: '/api/groups/:id/members/:memberId/remove',
        method: 'PUT'
      }
    });
  });

'use strict';

angular.module('roadAmicoApp')
  .factory('Verification', function ($http) {

    return {
      pending: function () {
        var data = [];
        data.$promise = $http.get('/api/verification/pending').success(function (result) {
          angular.extend(data, result);
        });
        return data;
      },
      approved: function () {
        var data = [];
        data.$promise = $http.get('/api/verification/approved').success(function (result) {
          angular.extend(data, result);
        });
        return data;
      },
      denied: function () {
        var data = [];
        data.$promise = $http.get('/api/verification/denied').success(function (result) {
          angular.extend(data, result);
        });
        return data;
      },

      approve: function (id) {
        return $http.put('/api/verification/approve/' + id, {});
      },
      deny: function (id) {
        return $http.put('/api/verification/deny/' + id, {});
      }
    };

    //return $resource('/api/verification/:status/:id', {}, {
    //
    //  // Data retrieval
    //  pending: {
    //    method: 'GET',
    //    isArray: true,
    //    params: {
    //      status: 'pending'
    //    }
    //  },
    //  approved: {
    //    method: 'GET',
    //    isArray: true,
    //    params: {
    //      status: 'approved'
    //    }
    //  },
    //  denied: {
    //    method: 'GET',
    //    isArray: true,
    //    params: {
    //      status: 'denied'
    //    }
    //  },
    //
    //  // Actions
    //  approve: {
    //    method: 'PUT',
    //    params: {
    //      status: 'approve'
    //    }
    //  },
    //  deny: {
    //    method: 'PUT',
    //    params: {
    //      status: 'deny'
    //    }
    //  }
    //});

  });

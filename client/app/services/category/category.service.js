'use strict';

angular.module('roadAmicoApp')
  .factory('Category', function ($resource) {
    return $resource('/api/categories/:id', {id: '@_id'});
  });

'use strict';

angular.module('roadAmicoApp').directive('serviceListing', function () {
  return {
    scope: {
      'service': '=serviceListing',
      removeCategory: '=?',
      removeProvider: '=?'
    },
    templateUrl: 'app/directives/serviceListing/serviceListing.html'
  };
});

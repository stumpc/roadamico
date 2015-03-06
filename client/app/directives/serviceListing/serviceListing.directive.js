'use strict';

angular.module('roadAmicoApp').directive('serviceListing', function (Auth) {
  return {
    scope: {
      'service': '=serviceListing',
      removeCategory: '=?',
      removeProvider: '=?'
    },
    templateUrl: 'app/directives/serviceListing/serviceListing.html',
    link: function (scope) {
      scope.isLoggedIn = Auth.isLoggedIn;
      scope.authUser = Auth.getCurrentUser();
    }
  };
});

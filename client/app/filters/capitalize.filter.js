'use strict';

angular.module('roadAmicoApp')
  .filter('capitalize', function () {
    return function (input) {
      return input && input.charAt(0).toLocaleUpperCase() + input.substr(1);
    };
  });

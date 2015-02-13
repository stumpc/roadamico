'use strict';

angular.module('roadAmicoApp')
  .filter('https', function () {
    return function (input) {
      return input.replace('http://', 'https://')
    };
  });

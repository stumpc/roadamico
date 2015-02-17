'use strict';

angular.module('roadAmicoApp')
  .filter('https', function () {
    return function (input) {
      if (!input) {
        return input;
      } else {
        return input.replace('http://', 'https://')
      }
    };
  });

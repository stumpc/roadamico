'use strict';

angular.module('roadAmicoApp')
  .filter('unread', function () {
    return function (input, not) {
      if (input) {
        return input.filter(function (message) {
          return !message.read;
        });
      }
      return input;
    };
  });

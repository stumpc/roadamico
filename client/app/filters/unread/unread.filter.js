'use strict';

angular.module('roadAmicoApp')
  .filter('unread', function () {
    return function (input, not) {
      return input.filter(function (message) {
        return !message.read;
      });
    };
  });

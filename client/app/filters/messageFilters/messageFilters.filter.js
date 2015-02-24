'use strict';

angular.module('roadAmicoApp')
  .filter('unread', function (Auth) {
    return function (input, count) {
      if (!input) {
        return;
      }

      if (!(input instanceof Array)) {
        return !input.read && input.to._id === Auth.getCurrentUser()._id;
      }

      var result = input.filter(function (message) {
        return !message.read && message.to._id === Auth.getCurrentUser()._id;
      });
      if (count === true) {
        return result.length;
      } else {
        return result;
      }
    };
  })
  .filter('messageTarget', function (Auth) {
    return function (message, property) {
      if (!message) {
        return;
      }

      property = property || '_id';
      return message.to._id === Auth.getCurrentUser()._id ? message.from[property] : message.to[property];
    };
  });

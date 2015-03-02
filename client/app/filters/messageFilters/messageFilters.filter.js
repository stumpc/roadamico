'use strict';

angular.module('roadAmicoApp')
  .filter('unread', function (Auth) {
    return function (input, count) {
      if (!input) {
        return;
      }

      if (!(input instanceof Array)) {
        return !input.notification && !input.read && input.to._id === Auth.getCurrentUser()._id;
      }

      var result = input.filter(function (message) {
        return !message.notification && !message.read && message.to._id === Auth.getCurrentUser()._id;
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
      if (!message || message.notification) {
        return;
      }

      if (property !== 'name' && property !== 'photo') {
        property = '_id';
      }
      return message.to._id === Auth.getCurrentUser()._id ? message.from[property] : message.to[property];
    };
  })
  .filter('notifications', function () {
    return function (input, count) {
      if (!input) {
        return;
      }

      if (!(input instanceof Array)) {
        return input.notification && !input.read;
      }

      var result = input.filter(function (message) {
        return message.notification && !message.read;
      });
      if (count === true) {
        return result.length;
      } else {
        return result;
      }
    };
  });

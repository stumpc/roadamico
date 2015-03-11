'use strict';

angular.module('roadAmicoApp')

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

  .filter('toMe', function (Auth) {
    return function (input) {
      var userId = Auth.getCurrentUser()._id;
      if (input instanceof Array) {
        return _.filter(input, {to: {_id: userId}});
      } else {
        return input && input.to && input.to._id === userId;
      }
    };
  })

  .filter('notifications', function () {
    return function (input) {
      if (input instanceof Array) {
        return _.filter(input, {notification: true});
      } else {
        return input && input.notification;
      }
    };
  })

  .filter('unread', function () {
    return function (input) {
      if (input instanceof Array) {
        return _.filter(input, function (m) {
          return !m.read;
        });
      } else {
        return input && !input.read;
      }
    }
  })

  .filter('count', function () {
    return function (input) {
      return input && input.length;
    }
  });

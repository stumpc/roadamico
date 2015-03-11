'use strict';

/**
 * The session cache holds application data in a single place so that subsequent pages don't need to load it again and
 * again. This data is lazy loaded and includes:
 * - Services
 * - Categories
 * - User profiles
 * - Messages
 */
angular.module('roadAmicoApp')
  .factory('sessionCache', function ($rootScope, $log, Message, User, Service, Category, Auth, $injector) {

    var cache = {};

    $rootScope.$on('auth::logout', function () {
      var socket = $injector.get('socket');
      cache = {};
      socket.unsyncUpdates('message');
      socket.unsyncUpdates('service');
      socket.unsyncUpdates('category');
    });

    return {
      messages: function (returnPromise) {
        if (!Auth.isLoggedIn()) {
          return [];
        }
        if (!cache.messages) {
          $log.log('Caching messages');
          cache.messages = Message.mine();

          // Sync data
          cache.messages.$promise.then(function () {
            var socket = $injector.get('socket');
            socket.syncUpdates('message', cache.messages);
          });
        }
        if (returnPromise) {
          return function () { return cache.messages.$promise; };
        }
        return cache.messages;
      },

      profiles: function (returnPromise) {
        // User profiles are not synced
        if (!cache.profiles) {
          $log.log('Caching profiles');
          cache.profiles = User.profiles();
        }
        if (returnPromise) {
          return function () { return cache.profiles.$promise; };
        }
        return cache.profiles;
      },

      services: function (returnPromise) {
        if (!cache.services) {
          $log.log('Caching services');
          cache.services = Service.query();

          // Sync data if logged in
          if (Auth.isLoggedIn()) {
            cache.services.$promise.then(function () {
              var socket = $injector.get('socket');
              socket.syncUpdates('service', cache.services);
            });
          }
        }
        if (returnPromise) {
          return function () { return cache.services.$promise; };
        }
        return cache.services;
      },

      categories: function (returnPromise) {
        if (!cache.categories) {
          $log.log('Caching categories');
          cache.categories = Category.query();

          // Sync data if logged in
          if (Auth.isLoggedIn()) {
            cache.categories.$promise.then(function () {
              var socket = $injector.get('socket');
              socket.syncUpdates('category', cache.categories);
            });
          }
        }
        if (returnPromise) {
          return function () { return cache.categories.$promise; };
        }
        return cache.categories;
      }
    };
  });

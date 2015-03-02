'use strict';

angular.module('roadAmicoApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, config, sessionCache, Message) {
    $scope.config = config;

    $scope.menu = [
      {
        title: 'Home',
        link: '/home'
      },
      {
        title: 'Search',
        link: '/search'
      },
      {
        title: 'Browse',
        link: '/categories/browse'
      }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    // Received Messages
    $scope.messages = sessionCache.messages();
    $scope.messages.$promise && $scope.messages.$promise.then(function (messages) {
      $scope.notifications = _(messages)
        .filter({notification: true})
        .forEach(function (message) {
          message.moment = moment(message.time);
        })
        .sortBy('moment')
        .map(function (message) {
          return message.moment.calendar() + ': ' + message.message;
        })
        .value().reverse().join('<hr>');
    });

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      //return route === $location.path();
      return $location.path().indexOf(route) === 0;
    };

    // Notifications
    $scope.viewNotifications = function () {
      console.log('mark as read');
      _($scope.messages).filter(function (message) {
        return message.notification && !message.read;
      }).forEach(function (message) {
        message.read = true;
        Message.mark(message);
      });
    };

  });

'use strict';

angular.module('roadAmicoApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, Message, config, $injector) {
    $scope.config = config;

    $scope.menu = [
      {
        title: 'Home',
        link: '/home'
      },
      {
        title: 'Find Services',
        link: '/categories/browse'
      }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    // Received Messages
    $scope.messages = [];
    if (Auth.isLoggedIn()) {
      // Don't load the socket until we are logged in
      var socket = $injector.get('socket');
      $scope.messages = Message.received();

      socket.syncUpdatesIf('message', $scope.messages, function (message) {
        return message.to._id === Auth.getCurrentUser()._id;
      });

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('message');
      });
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      //return route === $location.path();
      return $location.path().indexOf(route) === 0;
    };
  });

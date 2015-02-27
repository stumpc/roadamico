'use strict';

angular.module('roadAmicoApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, config, sessionCache) {
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

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      //return route === $location.path();
      return $location.path().indexOf(route) === 0;
    };
  });

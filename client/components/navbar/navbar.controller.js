'use strict';

angular.module('roadAmicoApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, config) {
    $scope.config = config;

    $scope.menu = [
      {
        title: 'Home',
        link: '/home'
      },
      {
        title: 'Search',
        link: '/search'
      }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });

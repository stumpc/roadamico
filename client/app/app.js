'use strict';

angular.module('roadAmicoApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'angularFileUpload',
  'ngAutocomplete',
  'google.places',
  'ngMap',
  'pascalprecht.translate',
  'ui.select',
  'angularUtils.directives.dirDisqus',
  'akoenig.deckgrid'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to home
      responseError: function(response) {
        if(response.status === 401) {
          if ($location.path() !== '/login') {
            $location.path('/');
          }
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, $document, Auth) {
    // Check authentication when moving between pages (states)
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if ((next.authenticate || next.admin) && !loggedIn) {

          // Redirect to login if route requires auth and you're not logged in
          $location.path('/login');
        } else if (next.admin && !Auth.isAdmin()) {

          // If route requires admin and you are not one then go home
          $location.path('/home');
        } else {

          // Set the title
          if (next.title) {
            $document[0].title = next.title;
          } else {
            $document[0].title = 'RoadAmico';
          }
        }
      });
    });
  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/',
        templateUrl: 'app/signup/signup.html',
        controller: 'SignupCtrl'
      });
  });
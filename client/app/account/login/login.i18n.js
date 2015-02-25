'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      'login-email': 'Email',
      'login-password': 'Password'
    });
    $translateProvider.translations('fr', {
      'login-email': 'Email',
      'login-password': 'Mot de Passe'
    });
  });

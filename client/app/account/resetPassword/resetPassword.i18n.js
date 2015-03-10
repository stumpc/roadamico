'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      'reset-password': {
        title: 'Reset Password',
        'cant-change': 'Couldn\'t change password',
        'bad-url': 'Invalid password reset URL'
      }
    });
  });

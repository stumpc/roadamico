'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      'forgot-password': 'Forgot your password?',
      'connect-facebook': 'Connect with Facebook',
      'connect-google': 'Connect with Google+',
      'connect-twitter': 'Connect with Twitter',
      'connect-linkedin': 'Connect with LinkedIn'
    });
  });

'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      login: {
        'forgot-password': 'Forgot your password?',
        'reset-password-message': 'Please enter your email address and we will send you a link which you can use to reset your password.',
        'email-sent': 'An email has been sent containing a link to reset your password.',
        'email-error-title': 'Error sending email',
        'email-error': 'There was a problem sending the password reset email.'
      }
    });
  });

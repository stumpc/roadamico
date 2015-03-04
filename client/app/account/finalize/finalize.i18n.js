'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      'finalize-title': 'Finalize your account details',
      'finalize-account-information': 'Account Information',

      // Help messages
      'name-required': 'Your name is required.',
      'email-required': 'Enter a valid email.',
      'timezone-required': 'A timezone is required.',
      'password-length': 'Password must be at least 8 characters long.',
      'password-match': 'Passwords must match.'
    });
  });

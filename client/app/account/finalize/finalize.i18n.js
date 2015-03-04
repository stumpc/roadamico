'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      finalize: {
        'title': 'Finalize your account details',
        'account-information': 'Account Information',
        'invalid-user-id': 'Invalid user ID',
        'error-change-pw': 'Error changing password'
      }
    });
  });

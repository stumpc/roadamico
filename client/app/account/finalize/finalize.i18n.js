'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      'finalize-title': 'Finalize your account details',
      'finalize-account-information': 'Account Information'
    });
  });

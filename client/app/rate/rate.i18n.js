'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      rate: {
        instructions: 'Please take a moment to rate your experience. By doing this you\'re helping out fellow travelers.',
        Stars: 'Stars',
        Notes: 'Notes',
        'enter-notes': 'Enter notes here'
      }
    });
  });

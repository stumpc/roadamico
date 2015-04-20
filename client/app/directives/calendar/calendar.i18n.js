'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      calendar: {
        'num-availabilities': 'Availabilities on this day:',
        'book-now': 'Book Now',
        'book-cost': 'for'
      }
    });
  });

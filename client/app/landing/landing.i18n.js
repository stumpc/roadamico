'use strict';

angular.module('roadAmicoApp')
  .config(function ($translateProvider) {
    $translateProvider.translations('en', {
      'landing-travelers': 'Travelers',
      'landing-unite': 'Unite'
    });
    $translateProvider.translations('fr', {
      'landing-travelers': 'Voyageurs',
      'landing-unite': 'Rassemblez-Vous'
    });
  });

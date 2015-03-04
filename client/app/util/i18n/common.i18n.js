'use strict';

angular.module('roadAmicoApp')
  .config(function ($windowProvider, $translateProvider) {

    // Put common translations here
    $translateProvider.translations('en', {
      Save: 'Save',
      Cancel: 'Cancel',
      Password: 'Password'
    });
    $translateProvider.translations('fr', {
      Save: 'Enregistrer',
      Cancel: 'Annuler',
      Password: 'Mot de Passe'
    });
  });

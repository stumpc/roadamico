'use strict';

angular.module('roadAmicoApp')
  .config(function ($windowProvider, $translateProvider) {

    // Put common translations here
    $translateProvider.translations('en', {
      Save: 'Save',
      Cancel: 'Cancel',
      Password: 'Password',
      Name: 'Name',
      Email: 'Email',
      Timezone: 'Timezone',
      Languages: 'Languages'

    });
    $translateProvider.translations('fr', {
      Save: 'Enregistrer',
      Cancel: 'Annuler',
      Password: 'Mot de Passe',
      Name: 'Nom',
      Email: 'Email',
      Timezone: 'Fuseau Horaire',
      Languages: 'Langues'

    });
  });

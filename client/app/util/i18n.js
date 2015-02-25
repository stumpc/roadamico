'use strict';

angular.module('roadAmicoApp')
  .config(function ($windowProvider, $translateProvider) {
    // Determine language. From https://github.com/angular-translate/angular-translate/blob/master/src/service/translate.js
    function getLanguage() {
      var nav = $windowProvider.$get().navigator, i, language,
        browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];

      if (angular.isArray(nav.languages)) { // support for HTML 5.1 "navigator.languages"
        for (i = 0; i < nav.languages.length; i++) {
          language = nav.languages[i];
          if (language && language.length) {
            return language;
          }
        }
      }

      for (i = 0; i < browserLanguagePropertyKeys.length; i++) { // support for other well known properties in browsers
        language = nav[browserLanguagePropertyKeys[i]];
        if (language && language.length) {
          return language;
        }
      }
      return 'en';
    }

    $translateProvider.determinePreferredLanguage(function () {
      return getLanguage().substr(0,2);
    });


    // Standard translations. Put common translations here
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

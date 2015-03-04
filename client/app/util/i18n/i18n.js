'use strict';

angular.module('roadAmicoApp')
  .run(function ($rootScope, Auth, $window, $translate, config) {

    // Determine language. From https://github.com/angular-translate/angular-translate/blob/master/src/service/translate.js
    function detectLanguage() {
      var nav = $window.navigator, i, language,
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


    // Set the language to be the authenticated user's first listed language
    function useUsersLang() {
      Auth.getCurrentUser().$promise.then(function (user) {
        if (user.languages && user.languages.length) {
          var lang = user.languages[0].substr(0,2).toLowerCase();
          $translate.use(lang);

          if (config.translate.useFallback) {
            $translate.fallbackLanguage(config.translate.fallback);
          }
        } else {
          $translate.use(detectLanguage());
          if (config.translate.useFallback) {
            $translate.fallbackLanguage(config.translate.fallback);
          }
        }
      });
    }

    Auth.isLoggedInAsync(function (val) {
      val && useUsersLang();
    });
    $rootScope.$on('auth::login', useUsersLang);
    $rootScope.$on('auth::logoff', function () {
      $translate.use(detectLanguage());
      if (config.translate.useFallback) {
        $translate.fallbackLanguage(config.translate.fallback);
      }
    });
  });

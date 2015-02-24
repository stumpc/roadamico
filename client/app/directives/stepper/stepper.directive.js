'use strict';

angular.module('roadAmicoApp')
  .directive('stepper', function () {
    return {
      link: function (scope, element) {
        $(element).stepper();
      }
    };
  });

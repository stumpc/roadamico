'use strict';

angular.module('roadAmicoApp')
  .directive('stepper', function () {
    return {
      link: function (scope, element, attrs) {
        $(element).stepper();
      }
    };
  });

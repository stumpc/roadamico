'use strict';

angular.module('roadAmicoApp')
  .directive('colorpicker', function () {
    return {
      templateUrl: 'app/directives/colorpicker/colorpicker.html',
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        colors: '=?',
        active: '=ngModel'
      },
      link: function (scope, element, attrs, ctrl) {

        scope.colors = scope.colors || [
          'ra-red',
          'bluejeans-light',
          'bluejeans-dark',
          'aqua-light',
          'aqua-dark',
          'mint-light',
          'mint-dark',
          'grass-light',
          'grass-dark',
          'sunflower-light',
          'sunflower-dark',
          'bittersweet-light',
          'bittersweet-dark',
          'grapefruit-light',
          'grapefruit-dark',
          'lavender-light',
          'lavender-dark',
          'pinkrose-light',
          'pinkrose-dark',
          'lightgray-light',
          'lightgray-dark',
          'mediumgray-light',
          'mediumgray-dark',
          'darkgray-light',
          'darkgray-dark'
        ];

        scope.isHex = function (color) {
          return color.substr(0,1) === '#';
        };

        scope.select = function (color, event) {
          ctrl.$setViewValue(color, event);
        };

      }
    };
  });

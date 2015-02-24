'use strict';

angular.module('roadAmicoApp').directive('pwCheck', function () {
  return {
    require: 'ngModel',
    scope: {
      'password': '=pwCheck'
    },
    link: function (scope, elem, attrs, ctrl) {
      scope.$watch('password', function (val) {
        ctrl.$setValidity('pwMismatch', val === ctrl.$viewValue);
      });

      ctrl.$validators.pwMismatch = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        return value === scope.password;
      };
    }
  };
});

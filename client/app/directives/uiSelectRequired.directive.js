'use strict';

angular.module('roadAmicoApp').directive('uiSelectRequired', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {
        return modelValue && modelValue.length;
      };
    }
  };
});

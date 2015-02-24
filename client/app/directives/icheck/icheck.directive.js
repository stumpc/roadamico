'use strict';

angular.module('roadAmicoApp')
  .directive('icheck', function ($timeout) {
    return {
      require: 'ngModel',
      link: function ($scope, element, $attrs, ngModel) {
        return $timeout(function () {
          var value;
          value = $attrs.value;

          $scope.$watch($attrs.ngModel, function () {
            $(element).iCheck('update');
          });

          return $(element).iCheck({
            checkboxClass: 'icheckbox_flat',
            radioClass: 'iradio_flat',
            increaseArea: '20%'
          }).on('ifChanged', function (event) {
            if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
              $scope.$apply(function () {
                return ngModel.$setViewValue(event.target.checked);
              });
            }
            if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
              return $scope.$apply(function () {
                return ngModel.$setViewValue(value);
              });
            }
          });
        });
      }
    };
  });

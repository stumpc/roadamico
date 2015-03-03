'use strict';

angular.module('roadAmicoApp')
  .directive('durationpicker', function () {
    return {
      templateUrl: 'app/directives/durationpicker/durationpicker.html',
      restrict: 'EA',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {

        var unitOrdering = {
          second: 0,
          minute: 1,
          hour:   2,
          day:    3,
          week:   4,
          month:  5,
          year:   6
        };

        var min = unitOrdering[attrs.minUnit || 'second'];
        var max = unitOrdering[attrs.maxUnit || 'year'];
        var required = attrs.required;

        scope.units = _.filter([
          {id: 'second', name: 'Second(s)'},
          {id: 'minute', name: 'Minute(s)'},
          {id: 'hour', name: 'Hour(s)'},
          {id: 'day', name: 'Day(s)'},
          {id: 'week', name: 'Week(s)'},
          {id: 'month', name: 'Month(s)'},
          {id: 'year', name: 'Year(s)'}
        ], function (unit) {
          var order = unitOrdering[unit.id];
          return order >= min && order <= max;
        });

        scope.update = function () {
          // Validation
          ctrl.$setValidity('length', true);
          ctrl.$setValidity('unit', true);
          if (required) {
            if (!scope.length) {
              ctrl.$setValidity('length', false);
            }
            if (!scope.unit) {
              ctrl.$setValidity('unit', false);
            }
            if (!scope.length || !scope.unit) {
              return;
            }
          }
          ctrl.$setViewValue(scope.length + ' ' + scope.unit);
        };

        //ctrl.$viewChangeListeners.push(function () {
        //  var parts = ctrl.$viewValue.split(' ');
        //  scope.length = Number(parts[0]);
        //  scope.unit = parts[1];
        //});

      }
    };
  });

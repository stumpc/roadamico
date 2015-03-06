'use strict';

angular.module('roadAmicoApp')
  .directive('availabilityForm', function () {
    return {
      scope: {
        availability: '=availabilityForm',
        submit: '&',
        cancel: '@'
      },
      templateUrl: 'app/services/availabilityForm/availabilityForm.html',
      link: function (scope, elem, attrs) {
        scope.save = attrs.buttontext || 'Save';
        scope.submit = scope.submit || angular.noop();


        scope.disabled = function (date, mode) {
          if (!scope.availability.repeat || !scope.availability.repeat.period) {
            return false;
          }

          if (scope.availability.repeat.period === 'day') {
            return date < scope.availability.datetime;
          } else if (scope.availability.repeat.period === 'week') {
            return date.getDay() !== scope.availability.datetime.getDay();
          } else if (scope.availability.repeat.period === 'month') {
            return date.getDate() !== scope.availability.datetime.getDate();
          } else {
            return true;
          }
        }
      }
    };
  });

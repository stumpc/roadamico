'use strict';

angular.module('roadAmicoApp')
  .directive('availabilityForm', function () {
    return {
      scope: {
        availability: '=availabilityForm',
        submit: '&',
        cancel: '@'
      },
      templateUrl: 'app/services/calendar/availabilityForm/availabilityForm.html',
      link: function (scope, elem, attrs) {
        scope.save = attrs.buttontext || 'Save';
        scope.submit = scope.submit || angular.noop();
      }
    };
  });

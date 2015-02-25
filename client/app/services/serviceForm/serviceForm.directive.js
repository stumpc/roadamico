'use strict';

angular.module('roadAmicoApp')
  .directive('serviceForm', function (Category) {
    return {
      scope: {
        service: '=serviceForm',
        submit: '&',
        cancel: '@'
      },
      templateUrl: 'app/services/serviceForm/serviceForm.html',
      link: function (scope, elem, attrs) {
        scope.save = attrs.buttontext || 'Save';
        scope.categories = Category;
        scope.submit = scope.submit || angular.noop();

        scope.add = function () {
          if (!scope.service) { scope.service = {}; }
          if (!scope.service.details) { scope.service.details = []; }
          scope.service.details.push({});
        };

        scope.remove = function (index) {
          scope.service.details.splice(index, 1);
        };
      }
    };
  });

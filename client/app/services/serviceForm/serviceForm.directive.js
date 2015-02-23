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
      link: function (scope, elem, attrs, ctrl) {
        scope.save = attrs['buttontext'] || 'Save';
        scope.categories = Category;
        scope.submit = scope.submit || angular.noop();
      }
    };
  });

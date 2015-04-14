'use strict';

angular.module('roadAmicoApp')
  .directive('placeForm', function () {
    return {
      templateUrl: 'app/places/form/placeForm.html',
      restrict: 'EA',
      scope: {
        originalPlace: '=place',
        onSave: '&'
      },
      link: function (scope, element, attrs) {
        scope.place = angular.copy(scope.originalPlace);

        scope.save = function () {
          scope.onSave({updated: scope.place});
        }
      }
    };
  });

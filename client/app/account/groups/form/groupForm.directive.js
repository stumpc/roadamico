'use strict';

angular.module('roadAmicoApp')
  .directive('groupForm', function () {
    return {
      templateUrl: 'app/account/groups/form/groupForm.html',
      restrict: 'EA',
      scope: {
        originalGroup: '=group',
        onSave: '&',
        back: '@?'
      },
      link: function (scope, element, attrs) {
        scope.group = angular.copy(scope.originalGroup);

        scope.$watch('group.locationDetails', function (value) {
          if (value) {
            scope.group.location = value.name;
          }
        });

        scope.save = function () {
          scope.onSave({updated: scope.group});
        }
      }
    };
  });

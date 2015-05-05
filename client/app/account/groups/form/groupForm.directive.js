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
          if (value && typeof value === 'object') {
            scope.group.location = value.name;

            if (value.geometry && value.location) {
              value.geometry.location.latitude = value.geometry.location.lat();
              value.geometry.location.longitude = value.geometry.location.lng();
            }
          }
        });

        scope.save = function () {
          scope.onSave({updated: scope.group});
        }
      }
    };
  });

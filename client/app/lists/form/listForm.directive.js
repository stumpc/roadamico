'use strict';

angular.module('roadAmicoApp')
  .directive('listForm', function (Group, Auth, User) {
    return {
      templateUrl: 'app/lists/form/listForm.html',
      restrict: 'EA',
      scope: {
        originalList: '=list',
        onSave: '&',
        back: '@?'
      },
      link: function (scope, element, attrs) {

        scope.list = angular.copy(scope.originalList) || {};
        scope.groups = Group.mine();
        scope.users = User.profiles();

        var user = Auth.getCurrentUser();
        scope.canCurate = function () {
          return user.role === 'admin' || user.role === 'curator';
        };

        scope.save = function () {
          scope.onSave({updated: scope.list});
        }
      }
    };
  });

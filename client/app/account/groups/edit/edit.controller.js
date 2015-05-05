'use strict';

angular.module('roadAmicoApp')
  .controller('EditGroupCtrl', function ($scope, $state, Group, group, Modal) {
    $scope.message = 'Hello';
    $scope.group = group;
    $scope.members = Group.members({id: group._id});

    $scope.deleteGroup = function () {
      Modal.confirm.delete(function () {
        group.$remove().then(function () {
          $state.go('profile');
        });
      })(group.name, null);
    };

    $scope.removeMember = function (member, index) {
      Modal.confirm.yesno(function () {
        Group.removeMember({id: group._id, memberId: member._id}, {}).$promise.then(function () {
          $scope.members.splice(index, 1);
        });
      })('remove ' + member.name + ' from your group');
    };

    $scope.update = function (updated) {
      updated.$update().then(function () {
        $state.go('profile');
      });
    };
  });

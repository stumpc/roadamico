'use strict';

angular.module('roadAmicoApp')
  .controller('SignupCtrl', function ($scope, $location, $window, $http, $state, Modal, Auth, Destination, Group) {
    $scope.user = {};
    $scope.errors = {};

    $scope.destinations = Destination.query();
    $scope.groups = Group.query();

    $scope.groups.$promise.then(function (groups) {
      $scope.terms = _(groups).map('term').uniq().value();
    });

    $scope.step1Complete = false;
    $scope.step1 = function (form) {
      if (!$scope.user.email) {
        return;
      }

      $http.get('/api/users/check/' + encodeURIComponent($scope.user.email))
        .success(function (result) {
          if (result.available) {
            $scope.step1Complete = true;
          } else {
            form.email.$setValidity('mongoose', false);
            $scope.errors.email = 'That email is already is use.';
          }
        });
    };

    $scope.canJoin = function (group) {
      return group.emails.indexOf($scope.user.email) > -1;
    };


    $scope.register = function() {
      Auth.createUser($scope.user)
        .then(function () {
          $state.go('home');
        })
        .catch( function(err) {
          err = err.data;
          if (err.message) {
            Modal.info.error(err.message);
          }
        });
    };
  });

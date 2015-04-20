'use strict';

angular.module('roadAmicoApp')
  .controller('ViewCtrl', function ($scope, event) {
    $scope.event = event;
  });

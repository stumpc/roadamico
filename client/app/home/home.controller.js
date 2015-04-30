'use strict';

angular.module('roadAmicoApp')
  .controller('HomeCtrl', function ($scope, userFeed) {

    userFeed().then(function (updates) {
      $scope.updates = updates;
    });


  });

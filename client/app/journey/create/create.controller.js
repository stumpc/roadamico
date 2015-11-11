'use strict';

angular.module('roadAmicoApp')
  .controller('CreateCtrl', function ($scope) {
    $scope.message = 'Hello';
    $scope.list = ["Old Well", "Clock Tower", "Kenan Stadium", "Davis Library", "Undergrad Library", "Franklin Street", "Polk Place", "Wesley's House"];
  });

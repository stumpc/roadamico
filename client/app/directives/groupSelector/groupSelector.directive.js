'use strict';

angular.module('roadAmicoApp')
  .directive('groupSelector', function () {
    return {
      templateUrl: 'app/directives/groupSelector/groupSelector.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
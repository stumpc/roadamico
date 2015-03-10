'use strict';

angular.module('roadAmicoApp')
  .controller('FeedCtrl', function ($scope, $resource) {
    $scope.feed = $resource('/api/feed').query();
  });

'use strict';

angular.module('roadAmicoApp')
  .controller('SearchCtrl', function ($scope, Search, placeUtil) {

    function process() {
      _.forEach($scope.results, function (result) {
        if (result.type === 'place') {
          result.rating = placeUtil.getRating(result);
          result.photo = placeUtil.getPhoto(result);
        }
        if (result.type === 'event') {
          result.when = moment(result.datetime).format('llll');
        }
      });
    }

    $scope.results = Search.getResults();
    $scope.query = Search.getQuery();
    $scope.newQuery = $scope.query;
    process();

    $scope.search = function () {
      Search.newSearch($scope.newQuery).then(function (results) {
        $scope.query = $scope.newQuery;
        $scope.results = results;
        process();
      });
    };
  });

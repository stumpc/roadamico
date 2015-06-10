'use strict';

angular.module('roadAmicoApp')
  .controller('SearchCtrl', function ($scope, Search, placeUtil) {
    $scope.showLoader = true;
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
        $scope.showLoader = false;
    }

    $scope.results = Search.getResults();
    $scope.query = Search.getQuery();
    $scope.newQuery = $scope.query;
    process();

    $scope.search = function () {
      if($scope.newQuery.length > 0){
          $scope.showLoader = true;
          Search.newSearch($scope.newQuery).then(function (results) {
            $scope.query = $scope.newQuery;
            $scope.results = results;
            process();
          });
      }
      else {
          $scope.query = $scope.newQuery;
          $scope.results = [];
      }
    };
  });

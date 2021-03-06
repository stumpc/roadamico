'use strict';

angular.module('roadAmicoApp')
  .controller('PlacesCtrl', function ($scope, Place, Auth, placeUtil) {
    $scope.showLoader = true;
    $scope.places = Place.query();


    $scope.places.$promise.then(function () {
      _.forEach($scope.places, function (result) {
        result.rating = placeUtil.getRating(result);
        result.photo = placeUtil.getPhoto(result);
      });
      $scope.showLoader = false;
    });

    $scope.deletePlace = function(place){
        $scope.showLoader = true;
        var params = {id: place._id};
        Place.remove(params, function(){
            $scope.places.splice($scope.places.indexOf(place), 1);
            $scope.showLoader = false;
        });

    };

    $scope.isLoggedIn = Auth.isLoggedIn;
  });

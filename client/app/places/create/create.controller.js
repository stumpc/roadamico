'use strict';

angular.module('roadAmicoApp')
  .controller('CreatePlaceCtrl', function ($scope, $state, Place) {

    $scope.place = {locationDetails:{}};

    $scope.$watch('place.locationDetails', function (value) {

      if (typeof value === 'object') {
        $scope.place.name = value.name;
        $scope.place.location = value.formatted_address;
        $scope.place.phone = value.formatted_phone_number;

        if (value.geometry && value.location) {
          console.log(value.geometry);
          value.geometry.location.latitude = value.geometry.location.lat();
          value.geometry.location.longitude = value.geometry.location.lng();
        }

        if (value.photos) {
          $scope.place.feed = value.photos.map(function (photo) {
            return {
              datetime: moment().toISOString(),
              photo: photo.getUrl({'maxWidth': photo.width, 'maxHeight': photo.height})
            }
          });
        }
      }

    });

    $scope.create = function () {
      Place.save($scope.place).$promise.then(function (place) {
        $state.go('place.view', {id: place._id});
      });
    }
  });

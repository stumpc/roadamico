'use strict';

angular.module('roadAmicoApp')
  .directive('placeForm', function ($location, Auth, Place) {
    return {
      templateUrl: 'app/places/form/placeForm.html',
      restrict: 'EA',
      scope: {
        originalPlace: '=place',
        onSave: '&',
        back: '@?'
      },
      link: function (scope, element, attrs) {
        scope.place = angular.copy(scope.originalPlace);
        scope.isLoggedIn = Auth.isLoggedIn;


        scope.save = function () {
          scope.onSave({updated: scope.place});
        }

        scope.deletePlace = function(){
          var params = {id: scope.place._id};
          Place.remove(params, function(){
              $location.url('/places');
          });
        };
      }
    };
  });

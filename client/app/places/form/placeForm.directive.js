'use strict';

angular.module('roadAmicoApp')
  .directive('placeForm', function ($location, Auth, Place, placeUtil) {
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
        scope.entry = { place: scope.place };
        scope.photos = {};
        scope.photos[scope.entry.place._id] = placeUtil.getPhoto(scope.entry.place);
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

          scope.showFileSelect = false;
          scope.showFileUpload = function(){
              scope.showFileSelect = true;
          };

          scope.$watch('photos[entry.place._id]', function (value) {
              if(value && (_.contains(value, "blob"))){
                  scope.showFileSelect = false;
              }
          });
      }
    };
  });

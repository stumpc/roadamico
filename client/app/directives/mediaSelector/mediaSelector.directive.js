'use strict';

angular.module('roadAmicoApp')
  .directive('mediaSelector', function ($http) {
    return {
      templateUrl: 'app/directives/mediaSelector/mediaSelector.html',
      restrict: 'EA',
      scope: {
        data: '=ngModel'
      },
      link: function (scope, element, attrs) {
        var $holder = element.find('.media-selector');

        scope.data = scope.data || {};
        //scope.urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi;

        // --- Drag and drop ---

        element.on('dragenter', function (event) {
          event.preventDefault();
          $holder.addClass('dragging');
        });

        element.on('dragleave', function (event) {
          event.preventDefault();
          $holder.removeClass('dragging');
        });

        element.on('dragover', function (event) {
          event.preventDefault();
          $holder.addClass('dragging');
        });

        element[0].addEventListener('drop', function (event) {
          event.preventDefault();
          $holder.removeClass('dragging');

          // Process the drop
          var dataTransfer = event.dataTransfer;
          var file = dataTransfer.files[0];

          scope.$apply(function () {
            scope.data.file = file;
            scope.data.photo = URL.createObjectURL(file);
          });
        });

        function cleanupImage() {
          // Delete the image url to prevent memory leaks
          if (scope.data.photo) {
            URL.revokeObjectURL(scope.data.photo);
            delete scope.data.photo;
          }
        }

        scope.$on('$destroy', function () {
          cleanupImage();
        });

        scope.onFileSelect = function (files) {
          scope.data.file = files[0];
          scope.data.photo = URL.createObjectURL(files[0]);
        };


        scope.$watch('data.url', function (value) {
          if (!value) return;
          $http.get('/api/utils/embed/' + encodeURIComponent(value))
            .success(function (result) {
              scope.data.embed = result;
            });
        });

        scope.cancel = function () {
          cleanupImage();
          scope.data = {};
        };

      }
    };
  });

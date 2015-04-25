'use strict';

angular.module('roadAmicoApp')
  .directive('mediaSelector', function ($http) {
    return {
      templateUrl: 'app/directives/mediaSelector/mediaSelector.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        var $holder = element.find('.media-selector');

        // Share data
        scope.data = {
          //embed: {
          //  url: 'http://www.firstaidforfree.com/wp-content/uploads/2015/02/FISHSHAPED.png',
          //  type: 'photo'
          //}
          //embed: {
          //  url: 'https://www.flickr.com/photos/nmnh/6721867207',
          //  type: 'link',
          //  thumbnail_url: 'http://farm8.staticflickr.com/7146/6721867207_416656d17d_z.jpg',
          //  title: 'Forcipiger longirostris - credit Sandra J. Raredon, Division of Fishes, NMNH',
          //  description: 'Learn more about Forcipiger longirostris X-ray Vision: Fish Inside Out'
          //}
          //embed: {
          //  url: 'http://www.youtube.com/watch?v=Zu5UyNkaqMY',
          //  type: 'video',
          //  thumbnail_url: 'http://i.ytimg.com/vi/Zu5UyNkaqMY/hqdefault.jpg',
          //  title: 'LEGO Avengers: Age of Ultron - Trailer Re-Creation',
          //  description: 'After 5 months of work (off and on) my shot for shot re-creation of the Age of Ultron teaser is finally finished! Hope you enjoy it! Watch this version side by side with the original! https://www.youtube.com/watch?v=-h1bDloSURM Behind the Scenes coming soon!',
          //  html: '<iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=http%3A%2F%2Fwww.youtube.com%2Fembed%2FZu5UyNkaqMY%3Ffeature%3Doembed&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DZu5UyNkaqMY&image=http%3A%2F%2Fi.ytimg.com%2Fvi%2FZu5UyNkaqMY%2Fhqdefault.jpg&key=internal&type=text%2Fhtml&schema=youtube" width="500" height="281" scrolling="no" frameborder="0" allowfullscreen></iframe>'
          //}
        };

        scope.urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi;

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
            scope.data.imageUrl = URL.createObjectURL(file);
          });
        });



        scope.$watch('url', function (value) {
          if (!value) return;
          $http.get('/api/utils/embed/' + encodeURIComponent(value))
            .success(function (result) {
              scope.data.embed = result;
            });
        });


        scope.cancel = function () {
          scope.data = {};
        };

        scope.share = function () {
          console.log('share');
        };

      }
    };
  });

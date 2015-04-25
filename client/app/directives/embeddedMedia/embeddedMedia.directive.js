'use strict';

angular.module('roadAmicoApp')
  .directive('embeddedMedia', function ($modal, $sce) {
    return {
      templateUrl: 'app/directives/embeddedMedia/embeddedMedia.html',
      restrict: 'EA',
      scope: {
        embed: '=embeddedMedia'
      },
      link: function (scope, element, attrs) {

        scope.viewEmbed = function () {
          var modalScope = scope.$new();
          modalScope.embedHtml = function (html) {
            return $sce.trustAsHtml(html);
          };

          $modal.open({
            templateUrl: 'app/directives/embeddedMedia/mediaModal.html',
            scope: modalScope
          });
        };
      }
    };
  });

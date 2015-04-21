'use strict';

angular.module('roadAmicoApp')
  .directive('eventForm', function () {
    return {
      templateUrl: 'app/places/events/form/eventForm.html',
      restrict: 'EA',
      scope: {
        originalEvent: '=event',
        onSave: '&'
      },
      link: function (scope, element, attrs) {

        scope.event = angular.copy(scope.originalEvent) || {};
        scope.event.meetup = !!(scope.event.meetupTime || scope.event.meetupPlace);

        scope.inPast = function (datetime) {
          return moment(datetime) < moment();
        };

        scope.save = function (event) {
          scope.onSave({updated: event});
        };

      }
    };
  });

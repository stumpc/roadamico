'use strict';

angular.module('roadAmicoApp')
  .directive('eventForm', function (Group) {
    return {
      templateUrl: 'app/places/events/form/eventForm.html',
      restrict: 'EA',
      scope: {
        originalEvent: '=event',
        onSave: '&',
        back: '@?'
      },
      link: function (scope, element, attrs) {

        scope.groups = Group.mine();
        scope.event = angular.copy(scope.originalEvent) || {};
        scope.event.groupRestriction = _.map(scope.event.groupRestriction, '_id');
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

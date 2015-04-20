'use strict';

angular.module('roadAmicoApp')
  .directive('calendar', function (Availability, $filter, Auth) {
    return {
      templateUrl: 'app/directives/calendar/calendar.html',
      restrict: 'EA',
      scope: {
        service: '=calendar'
      },
      link: function (scope, element, attrs) {

        scope.isLoggedIn = Auth.isLoggedIn;
        scope.authUser = Auth.getCurrentUser();


        var hourHeight = Number(attrs.hourHeight || 50);
        var startHour = Number(attrs.start || 8);
        var endHour = Number(attrs.end || 18);

        scope.view = attrs.view || 'cal';
        scope.day = moment();
        scope.sortField = attrs.sort || 'moment';
        scope.sortAsc = true;

        scope.setView = function (view) {
          scope.view = view;
          getAvailabilities();
        };

        scope.prevDay = function () {
          scope.day.subtract(1, 'day');
          getAvailabilities();
        };

        scope.nextDay = function () {
          scope.day.add(1, 'day');
          getAvailabilities();
        };

        scope.sort = function (criteria) {
          if (scope.sortField === criteria) {
            scope.sortAsc = !scope.sortAsc;
          }
          scope.sortField = criteria;
          getAvailabilities();
        };




        // Async loading pipeline
        var availabilities;
        scope.service.$promise
          .then(function () {           // Get the availabilities once the service loads
            return Availability.getUpcoming({serviceId: scope.service._id}).$promise
          })
          .then(function (data) {       // Add data to the availabilities once they load
            availabilities = data;
            _.forEach(availabilities, function (a) {
              a.moment = moment(a.datetime);
              var parts = a.duration.split(' ');
              a._duration = moment.duration(Number(parts[0]), parts[1]);
              // TODO: Translate this
              a.description = a._duration.humanize() + ' session at ' + a.moment.format('h:mm a') + ' for ' +
                $filter('currency')(a.cost) + (a.notes ? '. Specifics: "' + a.notes + '"' : '');
            });
          })
          .then(getAvailabilities);     // Process the availabilities


        /**
         * Processes/filters availabilities based on the view
         * List shows all; calendar shows only that day's
         */
        function getAvailabilities() {
          if (scope.view === 'cal') {
            scope.availabilities = _(availabilities).filter(function (a) {
              // Select only the availabilities for the day
              return a.moment.dayOfYear() === scope.day.dayOfYear() && a.moment.year() === scope.day.year();
            }).sortBy('moment').value();

            scope.hourContents = {};
            if (scope.availabilities.length) {

              // Adjust the hours to include the day's activities
              scope.hours = _.range(
                Math.min(startHour, scope.availabilities[0].moment.hour()),
                Math.max(endHour, scope.availabilities[scope.availabilities.length-1].moment.hour()+1)
              );

              // Make the data easily accesible
              angular.forEach(scope.availabilities, function (a) {
                scope.hourContents[a.moment.hour()] = scope.hourContents[a.moment.hour()] || [];
                scope.hourContents[a.moment.hour()].push(a);
                a.top = 100 * (a.moment.minute() / 60);
                a.height = hourHeight * (a._duration.minutes() + a._duration.hours()*60) / 60;
              });
            } else {
              scope.hours = _.range(startHour, endHour);
            }
          } else {
            scope.availabilities = _.sortBy(availabilities, scope.sortField);

            if (!scope.sortAsc) {
              scope.availabilities = scope.availabilities.reverse();
            }
          }
        }

        var hourFormat = Number(attrs.hourFormat || 12);
        scope.formatHour = function (hour) {
          if (hourFormat === 24) {
            return hour;
          } else {
            if (hour === 0)  { return '12 AM'; }
            if (hour === 12) { return '12 PM'; }
            if (hour < 12)   { return hour + ' AM'; }
            return (hour - 12) + ' PM';
          }
        };

      }
    };
  });

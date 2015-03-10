'use strict';

angular.module('roadAmicoApp')
  .controller('UpcomingCtrl', function ($scope, Availability, Modal, MessageModal) {
    $scope.message = 'Hello';

    // TODO: Show bookings that the user is offering
    $scope.message = MessageModal;

    var bookings;
    var offering;

    function process(collection) {
      var now = moment();
      return _.filter(collection, function (booking) {
        return moment(booking.datetime) >= now &&                   // Hasn't happened yet
          _.find(booking.booking.updates, {status: 'booked'}) &&    // Has been booked
          !_.find(booking.booking.updates, {status: 'canceled'});   // Not Canceled
      });
    }

    Availability.mine().$promise.then(function (_bookings) {
      bookings = _bookings;
      $scope.bookings = process(bookings);
    });

    Availability.offering().$promise.then(function (_offering) {
      offering = _offering;
      $scope.offering = process(offering);
    });

    $scope.cancel = Modal.confirm.yesno(function (booking) {
      booking.$cancel(function () {
        $scope.bookings = process(bookings);
        $scope.offering = process(offering);
      });
    });
  });

'use strict';

angular.module('roadAmicoApp')
  .controller('FooterCtrl', function ($scope, $modal, $http) {

    $scope.contactUs = function () {
      var modal = $modal.open({
        templateUrl: 'components/footer/contactModal.html',
        controller: function ($scope, Auth) {
          $scope.contactData = {};
          $scope.user = Auth.getCurrentUser();
          $scope.user.$promise && $scope.user.$promise.then(function (user) {
            $scope.contactData.email = user.email;
            $scope.contactData.id = user._id;
          });
        }
      });

      modal.result.then(function (data) {
        $http.post('/api/contact', data);
      });
    };


  });

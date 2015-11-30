'use strict';

angular.module('roadAmicoApp')
    .controller('JourneyCtrl', function($scope, $http) {
        $scope.message = 'Hello';

        $http.get('/api/journey/')
            .then(function(res) {
                $scope.journeys = res.data;
            });

    });
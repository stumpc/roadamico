'use strict';

angular.module('roadAmicoApp')
.controller('CreateCtrl', function($scope, $http) {
        $scope.message = 'Hello';
        // Pull the id from the parameter. This is different from lists and will have to change in 
        // the future. Ideally since we're using Angular, this should be replaced
        var journeyId = location.search.split('id=')[1]

        //$scope.list = ["Old Well", "Clock Tower", "Kenan Stadium", "Davis Library", "Undergrad Library", "Franklin Street", "Polk Place", "Wesley's House"];
        $scope.lists = { };

        if (journeyId != null) {
            $http.get('/api/journey/' + journeyId)
                .then(function(res) {

                    $scope.placeName = res.data.name;
                    $scope.newEntry.text = res.data.html;

                    var dests = res.data.destinations;

                    for (var i = 0; i < dests.length; i++) {
                        $scope.lists[dests[i]] = dests[i].replace(" ", "");
                    }

                });
        }

        $scope.addList = function() {
            $scope.lists[$scope.list] = $scope.list.replace(" ", "");
            $scope.list = '';
        };

        $scope.create = function() {
            var date = new Date();
            
            // Change from object to array for database entry. Without this it wouldn't be
            // compatable as of right now

            var array = $.map($scope.lists, function(value, index) {
                return [value];
            });

            console.log(array);

            var postData = {
                destinations: array,
                name: $scope.placeName,
                html: $scope.newEntry.text
            };

            $http.post('/api/journey/', postData);
        };

        $scope.update = function() {
            var date = new Date();
            
            // Change from object to array for database entry. Without this it wouldn't be
            // compatable as of right now

            var ar = $.map($scope.lists, function(value, index) {
                return [value];
            });

            var newData = {
                destinations: ar,
                name: $scope.placeName,
                html: $scope.newEntry.text
            };

            console.log(newData.destinations);

            $http.put('/api/journey/' + journeyId, newData);
        };
    });

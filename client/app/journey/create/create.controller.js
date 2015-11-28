'use strict';

angular.module('roadAmicoApp')
    .controller('CreateCtrl', function($scope, $http) {
        $scope.message = 'Hello';

        //$scope.list = ["Old Well", "Clock Tower", "Kenan Stadium", "Davis Library", "Undergrad Library", "Franklin Street", "Polk Place", "Wesley's House"];
        $scope.lists = {
            // "Old Well":"OldWell",
            // "Clock Tower":"ClockTower",
            // "Kenan Stadium":"KenanStadium",
            // "Davis Library":"DavisLibrary",
            // "Undergrad Library":"UndergradLibrary",
            // "Franklin Street":"FranklinStreet",
            // "Polk Place":"PolkPlace",
            // "Wesley's House":"WesleysHouse"
        };;

        $scope.addList = function() {
            console.log($scope.list);
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
                dateTime: date,
                destinations: array,
                name: $scope.placeName,
                html: $scope.newEntry.text
            };

            $http.post('/api/journey/', postData);
        };
    });
'use strict';

angular.module('roadAmicoApp')
  .controller('CreateCtrl', function ($scope, $http) {
    $scope.message = 'Hello';

    var x = {
    	"Old Well":"OldWell",
    	"Clock Tower":"ClockTower",
    	"Kenan Stadium":"KenanStadium",
    	"Davis Library":"DavisLibrary",
    	"Undergrad Library":"UndergradLibrary",
    	"Franklin Street":"FranklinStreet",
    	"Polk Place":"PolkPlace",
    	"Wesley's House":"WesleysHouse"
    };
    //$scope.list = ["Old Well", "Clock Tower", "Kenan Stadium", "Davis Library", "Undergrad Library", "Franklin Street", "Polk Place", "Wesley's House"];
    $scope.list = x;

    $scope.create = function() {
        var date = new Date();
        console.log($scope.placeName);
        console.log($scope.newEntry.text);

        var postData = {
            dateTime: date,
            name: $scope.placeName,
            html: $scope.newEntry.text
        };
        
        $http.post('/api/journey/', postData);
    };
  });

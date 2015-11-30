'use strict';

angular.module('roadAmicoApp')
  .controller('CreateCtrl', function ($scope) {
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
  });


 
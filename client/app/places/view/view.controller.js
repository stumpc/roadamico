'use strict';

angular.module('roadAmicoApp')
  .controller('ViewPlaceCtrl', function ($scope, $q, $window, $location, place, Modal, Google, Geolocator) {
    $scope.place = place;

    $scope.viewPhoto = function (photo) {
      Modal.info.image('', photo.url, '');
    };



    // Code for loading the map location

    // Map async loader
    var mapLoader = (function () {
      var deferred = $q.defer();
      $scope.$on('mapInitialized', function(event, map) {
        deferred.resolve(map);
      });
      return deferred.promise;
    }());

    // Set the map center and marker
    Geolocator(place).then(function (pos) {
      mapLoader.then(function (map) {
        map.setCenter(pos);
        new Google.maps.Marker({
          position: pos,
          map: map,
          title: place.location
        });
      });
    });


    // Code for loading the Disqus comments
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    $window.disqus_shortname = 'roadamico'; // Required - Replace '<example>' with your forum shortname
    $window.disqus_identifier = 'place:' + place._id;
    $window.disqus_title = 'RoadAmico: ' + place.name;
    $window.disqus_url = 'http://www.roadamico.com' + $location.absUrl();
    console.log($location.absUrl());

      /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

  });

'use strict';

angular.module('roadAmicoApp')
  .controller('ViewListCtrl', function ($scope, $q, $upload, $modal, $location, $document, $state, Auth, list, List, Place,
                                        placeUtil, editing, Modal, Geolocator, Google) {

    $document[0].title = 'RoadAmico - ' + list.name;

    $scope.list = list;
    $scope.user = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;

    //$scope.canEdit = function (list) {
    //  return Auth.isLoggedIn() && ($scope.user.role === 'admin' || $scope.user.role === 'curator' || !list.curated);
    //};


    $scope.canEdit = function (settings) {
      if (!Auth.isLoggedIn()) {
        return false;
      }
      var a = $scope.user.role === 'admin' || $scope.user.role === 'curator';
      var b = !!_.find(list.owners, function (userId) {
        return userId === $scope.user._id;
      });
      var c = !!_.find(list.groupRestriction, function (group) {
        return group.administrator === $scope.user._id;
      });
      var d = list.open && !settings;
      return a || b || c || d;
    };



    $scope.editing = editing;
    $scope.newEntry = {};

    // Following

    $scope.userFollowing = _.find($scope.user.following && $scope.user.following.lists, {list: list._id});

    $scope.follow = function () {
      $scope.user.$follow({target: 'list', tid: list._id}).then(function () {
        $scope.userFollowing = _.find($scope.user.following && $scope.user.following.lists, {list: list._id});
      });
    };

    $scope.unfollow = function () {
      $scope.user.$unfollow({target: 'list', tid: list._id}).then(function () {
        $scope.userFollowing = null;
      });
    };

    // Comment

    $scope.disqus = {
      id: 'list:' + list._id,
      url: $location.absUrl()
    };

    $scope.openComments = function () {
      var modalScope = $scope.$new();
      $modal.open({
        templateUrl: 'app/lists/view/commentModal.html',
        scope: modalScope
      });
    };

    // Editing

    $scope.ratings = {};
    $scope.photos = {};

    function process() {
      _.forEach(list.entries, function (entry) {
        if (entry.place) {

          $scope.ratings[entry.place._id] = placeUtil.getRating(entry.place);
          $scope.photos[entry.place._id] = placeUtil.getPhoto(entry.place);
        }
      });
    }
    process();

    $scope.save = function () {
      return list.$update().then(function () {
        process();
      });
    };

    $scope.selectedPlace = {};

    var getPlaces= function(){
        Place.query().$promise.then(function (places) {
            $scope.places = _.sortBy(places, function (place) { return place.locationDetails.name; });

            _.forEach($scope.places, function (place) {
                $scope.ratings[place._id] = placeUtil.getRating(place);
                $scope.photos[place._id] = placeUtil.getPhoto(place);
            });
        });
    };

    getPlaces();
    $scope.add = function () {
      var promise;
      if ($scope.newEntry.file) {
        var deferred = $q.defer();
        $upload.upload({
          url: ($scope.newEntry.file.type.indexOf('image') != -1) ? '/api/utils/upload' : '/api/utils/upload-file',
          file: $scope.newEntry.file
        }).success(function (data) {
          deferred.resolve(data.url);
        });
        promise = deferred.promise;
      } else {
        promise = $q.when();
      }

      promise.then(function (url) {
        list.entries.push({
          photo: url,
          text: $scope.newEntry.text,
          embed: $scope.newEntry.embed,
          place: $scope.newEntry.place && $scope.newEntry.place._id,
          datetime: moment().toISOString(),
          poster: $scope.user._id
        });
        $scope.newEntry = {};
        $scope.save();
      });
    };


    $scope.sortableOptions = {
        update: function(e, ui) {
            $scope.save();
        }
    };


    $scope.remove = function (index) {
      list.entries.splice(index, 1);
      $scope.save();
    };

    $scope.moveUp = function (index) {
      if (index === 0) return;
      var entry = list.entries.splice(index, 1)[0];
      list.entries.splice(index - 1, 0, entry);
      $scope.save();
    };

    $scope.moveDown = function (index) {
      if (index === list.entries.length - 1) return;
      var entry = list.entries.splice(index, 1)[0];
      list.entries.splice(index + 1, 0, entry);
      $scope.save();
    };


    $scope.delete = function () {
      Modal.confirm.delete(function () {
        list.$remove().then(function () {
          $state.go('lists');
        })
      })(list.name);
    };


    // --- Map ---

    $scope.mapVisible = false;
    _.forEach(list.entries, function (entry) {
      if (entry.place) {
        $scope.mapVisible = true;
      }
    });

    // Map async loader
    var mapLoader = (function () {
      var deferred = $q.defer();
      $scope.$on('mapInitialized', function(event, map) {
        deferred.resolve(map);
      });
      return deferred.promise;
    }());

    // Get an array of the places
    var placeArray = _(list.entries)
      .filter(function (entry) {
        return entry.place;
      })
      .map(function (entry) {
        return entry.place;
      })
      .value();

    // Get the lat/lon coords
    var coords = _.map(placeArray, function (place) {
      return Geolocator(place);
    });
    mapLoader.then(function (map) {

      $q.all(coords).then(function (data) {
        var average = [0, 0];
        _.forEach(data, function (coord) {
          average[0] += coord.lat();
          average[1] += coord.lng();

          new Google.maps.Marker({
            position: coord,
            map: map
          });

        });
        var pos = new Google.maps.LatLng(average[0] / data.length, average[1] / data.length);
        map.setCenter(pos);
      });
    });


        $scope.showAddPlaceForm = function(){
            var modalInstance = $modal.open({
                templateUrl: 'app/lists/view/addPlaceForm.html',
                controller: function ($scope, $modalInstance, addPlaceForm) {
                    $scope.form = {};

                    $scope.place = {locationDetails:{}};

                    $scope.$watch('place.locationDetails', function (value) {

                        if (typeof value === 'object') {
                            $scope.place.name = value.name;
                            $scope.place.location = value.formatted_address;
                            $scope.place.phone = value.formatted_phone_number;

                            if (value.geometry && value.geometry.location) {
                                console.log(value.geometry);
                                value.geometry.location.latitude = value.geometry.location.lat();
                                value.geometry.location.longitude = value.geometry.location.lng();
                            }

                            if (value.photos) {
                                $scope.place.feed = value.photos.map(function (photo) {
                                    return {
                                        datetime: moment().toISOString(),
                                        photo: photo.getUrl({'maxWidth': photo.width, 'maxHeight': photo.height})
                                    }
                                });
                            }
                        }

                    });

                    $scope.addPlace = function () {
                        if ($scope.form.addPlaceForm.$valid) {
                            console.log('add place form is in scope');
                            $modalInstance.close('closed');

                            Place.save($scope.place).$promise.then(function (place) {
                                console.log(place);
                                getPlaces();
                                $scope.newEntry.place = place;
                            });
                        } else {
                            console.log('add place form is not in scope');
                        }
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                scope: $scope,
                resolve: {
                    addPlaceForm: function () {
                        return $scope.addPlaceForm;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.showFileSelect = false;

        $scope.showFileUpload = function(){
            $scope.showFileSelect = true;
        };

        $scope.$watch('photos[newEntry.place._id]', function (value) {
            if(value && value.indexOf("blob") != -1){
                $scope.showFileSelect = false;
            }
        });

    });
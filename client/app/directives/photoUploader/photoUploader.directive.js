'use strict';

angular.module('roadAmicoApp')
    .directive('photoUploader', function ($http, $q, $upload, Place) {
        return {
            templateUrl: 'app/directives/photoUploader/photoUploader.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                data: '=ngModel',
                open: '&onOpen',
                showFileSelect: "="
            },
            link: function (scope, element, attrs) {
                var $holder = element.find('.photo-uploader');
                scope.data = scope.data || {};
                //scope.urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi;

                scope.loading = false;


                // --- Drag and drop ---

                element.on('dragenter', function (event) {
                    event.preventDefault();
                    $holder.addClass('dragging');
                });

                element.on('dragleave', function (event) {
                    event.preventDefault();
                    $holder.removeClass('dragging');
                });

                element.on('dragover', function (event) {
                    event.preventDefault();
                    $holder.addClass('dragging');
                });

                element[0].addEventListener('drop', function (event) {
                    event.preventDefault();
                    $holder.removeClass('dragging');

                    // Process the drop
                    var dataTransfer = event.dataTransfer;
                    var file = dataTransfer.files[0];
                    scope.$apply(function () {
                        scope.$parent.photos[scope.data.place._id] = URL.createObjectURL(file);
                        uploadPhoto(file);
                    });
                });


                scope.onFileSelect = function (files) {
                    scope.$parent.photos[scope.data.place._id] = URL.createObjectURL(files[0]);
                    uploadPhoto(files[0]);
                };

                var uploadPhoto = function(file) {
                    scope.loading = true;
                    var promise;
                    var deferred = $q.defer();
                    $upload.upload({
                        url: '/api/utils/upload',
                        file: file
                    }).success(function (data) {
                        deferred.resolve(data.url);
                    });
                    promise = deferred.promise;
                    promise.then(function (url) {
                        //console.log('URL: ' + url);
                        var feed = {
                            datetime: moment().toISOString(),
                            photo: url
                        }
                        Place.saveFeedPhoto({id: scope.data.place._id}, feed).$promise.then(function (_place) {
                            scope.loading = false;
                            //angular.copy(_place, scope.data.place);
                            //scope.$parent.showFileSelect = false;
                            //scope.showFileSelect = false;
                        });
                    });
                };

            }
        };
    });

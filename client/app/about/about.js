'use strict';

angular.module('roadAmicoApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('about', {
                url: '/about',
                templateUrl: 'app/about/about.html',
                controller: function(){},
                authenticate: true,
                title: 'RoadAmico - About'
            });
        //$urlRouterProvider.when('/home', '/home/upcoming');
    });

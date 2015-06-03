'use strict';

angular.module('roadAmicoApp')
    .factory('listUtil', function () {

        function average (nums) {
            return Math.round(nums.reduce(function (a, b) { return a + b; }, 0) / nums.length);
        }

        return {
            getRating: function (list) {
                return average(_.pluck(list.ratings, 'score'));
            }
        };

    });

angular.module('roadAmicoApp')
  .factory('filterChain', function ($filter) {
    return function () {
      var filters = [];
      var i;
      for (i = 0; i < arguments.length; i++) {
        filters.push($filter(arguments[i]));
      }

      return function (input) {
        for (i = 0; i < filters.length; i++) {
          input = filters[i](input);
        }
        return input;
      };
    };
  });

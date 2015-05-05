'use strict';

angular.module('roadAmicoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('createGroup', {
        url: '/profile/groups/create',
        templateUrl: 'app/account/groups/create/create.html',
        controller: 'CreateGroupCtrl'
      });
  });

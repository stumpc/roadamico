'use strict';

angular.module('roadAmicoApp')
  .service('MessageModal', function ($rootScope, $modal, Message) {

    return function (to) {

      var modalScope = $rootScope.$new();
      var modal;

      // Define the objects available on the scope here
      modalScope.name = to.name;
      modalScope.sendMessage = function (messageText) {
        Message.save({
          to: to._id,
          message: messageText
        });
        modal.close();
      };

      modal = $modal.open({
        templateUrl: 'app/messages/messageModal/messageModal.html',
        windowClass: 'modal-default',
        scope: modalScope
      });

    };

  });

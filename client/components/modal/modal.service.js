'use strict';

angular.module('roadAmicoApp')
  .factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass, size) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope,
        size: size
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        'delete': function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },

        'yesno': function(op) {
          op = op || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              confirmModal;

            confirmModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm',
                html: '<p>Are you sure you want to ' + name + '?</p>',
                buttons: [{
                  classes: 'btn-primary',
                  text: 'Yes',
                  click: function(e) {
                    confirmModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'No',
                  click: function(e) {
                    confirmModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-info');

            confirmModal.result.then(function(event) {
              op.apply(event, args);
            });
          };
        }
      },

      prompt: {
        password: function (note, cb) {
          if (!cb) {
            cb = note;
            note = null;
          }
          cb = cb || angular.noop;

          var message = '<p>Please enter your password:</p>';
          if (note) {
            message += '<p><strong>'+note+'</strong></p>';
          }

          var promptModal;
          promptModal = openModal({
            modal: {
              dismissable: true,
              title: 'Verify Password',
              html: message,
              input: {
                password: true
              },
              buttons: [{
                classes: 'btn-primary',
                text: 'Done',
                click: function(e, data) {
                  if (data) data = data.password;
                  promptModal.close(data);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function(e) {
                  promptModal.dismiss(e);
                }
              }]
            }
          }, 'modal-primary');

          promptModal.result.then(function(password) {
            cb(password);
          });
        },

        email: function (message, cb) {
          if (!cb) {
            cb = message;
            message = null;
          }
          cb = cb || angular.noop;

          var promptModal;
          promptModal = openModal({
            modal: {
              dismissable: true,
              title: 'Enter Email',
              html: message,
              input: {
                email: true
              },
              buttons: [{
                classes: 'btn-primary',
                text: 'Done',
                click: function(e, data) {
                  if (data) data = data.email;
                  promptModal.close(data);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function(e) {
                  promptModal.dismiss(e);
                }
              }]
            }
          }, 'modal-primary');

          promptModal.result.then(function(email) {
            cb(email);
          });
        }
      },

      /* Information modals */
      info: {
        error: function (title, message) {

          if (!message) {
            message = title;
            title = "Error";
          }

          var errorModal;
          errorModal = openModal({
            modal: {
              dismissable: true,
              title: title,
              html: message,
              buttons: [{
                classes: 'btn-default',
                text: 'Close',
                click: function (e) {
                  errorModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

        },

        message: function (title, message) {
          if (!message) {
            message = title;
            title = "Info";
          }

          var infoModal;
          infoModal = openModal({
            modal: {
              dismissable: true,
              title: title,
              text: message,
              buttons: [{
                classes: 'btn-default',
                text: 'Close',
                click: function (e) {
                  infoModal.dismiss(e);
                }
              }]
            }
          }, 'modal-info');
        },

        image: function (name, src, alt) {

          var imageModal;
          imageModal = openModal({
            modal: {
              dismissable: true,
              title: name,
              img: src,
              alt: alt,
              buttons: [{
                classes: 'btn-default',
                text: 'Close',
                click: function (e) {
                  imageModal.dismiss(e);
                }
              }]
            }
          }, 'modal-info', 'lg');
        }
      }
    };
  });

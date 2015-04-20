angular.module('roadAmicoApp')
  .controller('CardCtrl', function ($scope, $modal, $rootScope, $sce) {
    $scope.viewCard = function (card) {

      var modalScope = $rootScope.$new();
      var embed = card.embed && card.embed.length && card.embed[0];
      modalScope.photo = card.photo;
      modalScope.html = embed && embed.html;
      modalScope.title = (embed && embed.title) || 'View Photo';
      modalScope.embedHtml = function (html) {
        return $sce.trustAsHtml(html);
      };

      $modal.open({
        templateUrl: 'app/feed/postModal.html',
        scope: modalScope
      });

      console.log(card);
    };
  });

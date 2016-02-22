angular
.module('notes')
.controller('ChangeController', function ($scope, $uibModalInstance, change) {
  $scope.change = change;
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
});

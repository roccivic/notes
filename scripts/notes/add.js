angular
.module('notes')
.controller('AddNoteController', function ($scope, $http, $location) {
  $scope.add = true;
  $scope.tabs = {
    preview: {
      active: false
    },
    edit: {
      active: true
    }
  };
  $scope.note = {};
  $scope.submit = function() {
    $scope.error = false;
    $scope.saving = true;
    $http.post('/notes/add', $scope.note)
    .then(function() {
      $scope.saving = false;
      $location.path('/notes');
    }, function() {
      $scope.saving = false;
      $scope.error = 'Failed to save note';
    });
  };
});

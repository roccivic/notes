angular
.module('notes')
.controller('EditNoteController', function ($scope, $http, $location, $routeParams) {
  $scope.edit = true;
  $scope.tabs = {
    preview: {
      active: true
    },
    edit: {
      active: false
    }
  };
  $scope.loading  = true;
  if (!$routeParams._id) {
    $location.path('/notes');
  } else {
    $http.post('/notes/get', $routeParams)
    .then(function(response) {
      $scope.loading  = false;
      $scope.note = response.data;
    }, function() {
      $scope.loading = false;
      $scope.error = 'An error has occurred while retrieving the note.';
    });
  }
  $scope.submit = function() {
    $scope.success = false;
    $scope.error = false;
    $scope.saving = true;
    $http.post('/notes/edit', $scope.note)
    .then(function(response) {
      $scope.saving = false;
      $scope.success = true;
      $scope.note = response.data;
      $scope.tabs.preview.active = true;
    }, function() {
      $scope.saving = false;
      $scope.error = 'Failed to save note';
    });
  };
  $scope.delete = function() {
    if (confirm('You are about to DELETE a note!')) {
      $scope.error = false;
      $scope.deleting = true;
      $http.post('/notes/delete', $scope.note)
      .then(function() {
        $scope.deleting = false;
        $location.path('/notes');
      }, function() {
        $scope.deleting = false;
        $scope.error = 'Failed to delete note';
      });
    }
  };
});

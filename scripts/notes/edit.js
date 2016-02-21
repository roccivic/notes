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
    $scope.submitError = false;
    $scope.saving = true;
    $http.post('/notes/edit', $scope.note)
    .then(function(response) {
      $scope.saving = false;
      $scope.success = true;
      $scope.note = response.data;
      $scope.tabs.preview.active = true;
    }, function(response) {
      $scope.saving = false;
      if (response.status === 404) {
        $scope.submitError = 'It seems that someone deleted this note. Please reload the page and try again.';
      } else if (response.status === 409) {
        $scope.submitError = 'It seems that someone edited this note before you. Please reload the page and try again.';
      } else {
        $scope.submitError = 'Failed to save note.';
      }
    });
  };
  $scope.delete = function() {
    if (confirm('You are about to DELETE a note!')) {
      $scope.submitError = false;
      $scope.deleting = true;
      $http.post('/notes/delete', $scope.note)
      .then(function() {
        $scope.deleting = false;
        $location.path('/notes');
      }, function() {
        $scope.deleting = false;
        $scope.submitError = 'Failed to delete note';
      });
    }
  };
});

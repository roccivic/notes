angular
.module('notes')
.controller('NotesController', function ($scope, $http, $location) {
  $scope.loading = true;
  $http.get('/notes/list')
  .then(function(response){
    $scope.loading = false;
    $scope.notes = response.data;
  }, function(){
    $scope.loading = false;
    $scope.error = true;
  });
  $scope.edit = function(note) {
    $location.path('/notes/edit/' + note._id);
  };
});

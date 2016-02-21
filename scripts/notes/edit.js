angular
.module('notes')
.controller('EditNoteController', function ($scope, $http, $routeParams) {
  $scope.edit = true;
  $scope.tabs = {
    preview: {
      active: true
    },
    edit: {
      active: false
    }
  };
  $scope.note = {
    id: $routeParams.id
  }
});

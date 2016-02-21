angular
.module('notes')
.controller('AddNoteController', function ($scope, $http) {
  $scope.add = true;
  $scope.tabs = {
    preview: {
      active: false
    },
    edit: {
      active: true
    }
  };
  $scope.note = {}
});

angular
.module('notes')
.controller('MenuController', function ($scope, $http, $location) {
  $scope.loggedIn = function() {
    return $location.path() !== '/login';
  };
  $scope.logout = function() {
    $scope.loading = true;
    $http.post('/auth/logout').then(function() {
      $scope.loading = false;
      $location.path('/login');
    }, function() {
      $scope.loading = false;
      $location.path('/login');
    });
  };
  $scope.addNote = function() {
    $location.path('/notes/add');
  };
  $scope.home = function() {
    if ($scope.loggedIn()) {
      $location.path('/notes');
    } else {
      $location.path('/login');
    }
  };
});

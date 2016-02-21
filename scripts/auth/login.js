angular
.module('notes')
.controller('LoginController', function ($scope, $http, $location) {
  $scope.submit = function() {
    $scope.error = false;
    $scope.error500 = false;
    $scope.loading = true;
    $http.post('/auth/login', {
      email: $scope.email,
      password: $scope.password
    }).then(function() {
      $scope.loading = false;
      $location.path('/notes');
    }, function(response) {
      $scope.loading = false;
      if (response.status === 500) {
        $scope.error500 = true;
      } else {
        $scope.error = true;
      }
    });
  };
});

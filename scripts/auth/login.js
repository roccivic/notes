angular
.module('notes')
.controller('LoginController', function ($scope, $http, $location) {
  $scope.submit = function() {
    $scope.error = false;
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
        $scope.error = 'A server error occurred while processing your request. Please try again later.';
      } else {
        $scope.error = 'Username or password are invalid.'
      }
    });
  };
});

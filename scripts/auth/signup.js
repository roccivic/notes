angular
.module('notes')
.controller('SignupController', function ($scope, $http, $location) {
  $scope.submit = function() {
    $scope.error = false;
    $scope.success = false;
    if ($scope.password != $scope.password2) {
      $scope.error = 'Passwords do not match.';
    } else {
      $scope.loading = true;
      $http.post('/auth/signup', {
        name: $scope.name,
        email: $scope.email,
        password: $scope.password
      }).then(function() {
        $scope.loading = false;
        $scope.success = true;
      }, function(response) {
        $scope.loading = false;
        $scope.error = 'An error occurred while processing your request';
      });
    }
  };
});

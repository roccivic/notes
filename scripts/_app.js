angular
.module('notes', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  })
  .otherwise({
    redirectTo: '/login'
  });;
});

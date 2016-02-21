angular
.module('notes', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  })
  .when('/notes', {
    templateUrl: 'views/notes/list.html',
    controller: 'NotesController'
  })
  .otherwise({
    redirectTo: '/login'
  });;
});

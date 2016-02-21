angular
.module('notes', ['ngRoute', 'ui.bootstrap'])
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
  .when('/notes/add', {
    templateUrl: 'views/notes/edit.html',
    controller: 'AddNoteController'
  })
  .when('/notes/edit/:id', {
    templateUrl: 'views/notes/edit.html',
    controller: 'EditNoteController'
  })
  .otherwise({
    redirectTo: '/login'
  });;
})
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function($q, $location) {
    return {
      'responseError': function(rejection){
        var defer = $q.defer();
        if(rejection.status == 401){
            $location.path('/login');
        }
        defer.reject(rejection);
        return defer.promise;
      }
    };
  });
}]);

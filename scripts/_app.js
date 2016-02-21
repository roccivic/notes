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

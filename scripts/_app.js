angular
.module('notes', ['ngSanitize', 'ngRoute', 'ui.bootstrap', 'angularMoment', 'ng-showdown'])
.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: 'views/auth/login.html',
    controller: 'LoginController'
  })
  .when('/signup', {
    templateUrl: 'views/auth/signup.html',
    controller: 'SignupController'
  })
  .when('/notes', {
    templateUrl: 'views/notes/list.html',
    controller: 'NotesController'
  })
  .when('/notes/add', {
    templateUrl: 'views/notes/edit.html',
    controller: 'AddNoteController'
  })
  .when('/notes/edit/:_id', {
    templateUrl: 'views/notes/edit.html',
    controller: 'EditNoteController'
  })
  .otherwise({
    redirectTo: '/login'
  });;
})
.config(function($httpProvider) {
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
})
.config(function($showdownProvider) {
  $showdownProvider.setOption('tables', true);
})
.run(function(amMoment) {
  amMoment.changeLocale('en-UK');
});

'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', 
['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers'])
.config(['$routeProvider', '$locationProvider', 
    function($routeProvider, $locationProvider) {
      $routeProvider.
      when('/about', {
        templateUrl: 'partials/about.html', 
        controller: aboutCtrl})
      .when('/home',
      {
    	 templateUrl: 'partials/home.html',
    	 controller: indexCtrl
      })
      .when('/register',{
        templateUrl:'partials/userRegister.html',
        controller: 'userRegistrationCtrl'
      })
      .when('/login',{
        templateUrl:'partials/login.html',
        controller: 'loginCtrl'
      })
      .when('/user',{
        templateUrl:'partials/user.html',
        controller: 'userCtrl'
      })
      .when('/recharge',{
        templateUrl: 'partials/recharge.html',
        controller: 'rechargeCtrl'
      })
      /*
      when ('/addPost',{
    	  templateUrl: 'partials/addPost',
    	  controller: IndexCtrl
      }).
      when ('/readPost/:id',{
    	  templateUrl: 'partials/readPost',
    	  controller: ReadPostCtrl
      }).
      when ('/editPost/:id',{
    	  templateUrl: 'partials/editPost',
    	  controller: EditPostCtrl
      }).
      when ('/deletePost/:id',{
    	  templateUrl: 'partials/deletePost',
    	  controller: DeletePostCtrl
    	  
      }).
      when('/about', {templateUrl: 'partials/about.html', controller: 'aboutCtrl'}).*/
      .otherwise({
    	  redirectTo: '/'
      });
      
	  

    $locationProvider.html5Mode(true);
  }])
.filter('truncate', function() {
    return function(text, value) {
        value = value - 3;
        if (!value) {
            value = 12;
        }
        if (text && text.length > value)
            return text.substring(0, value) + "...";
        else
            return text;
    };
});

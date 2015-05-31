var app = angular.module('app', ['ui.router', 'app.controllers', 'app.services']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
		  resolve: {
		    postPromise: ['posts', function(posts){
		      return posts.getAll();
		    }]
		  }
    })
    .state('post', {
  		url: '/posts/:id',
  		templateUrl: '/post.html',
  		controller: 'PostsCtrl',
		  resolve: {
		    post: ['$stateParams', 'posts', function($stateParams, posts) {
		      return posts.get($stateParams.id);
		    }]
		  }
		})
		.state('login', {
		  url: '/login',
		  templateUrl: '/login.html',
		  controller: 'AuthCtrl',
		  onEnter: ['$state', 'auth', function($state, auth){
		    if(auth.isLoggedIn()){
		      $state.go('home');
		    }
		  }]
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
			  if(auth.isLoggedIn()){
			    $state.go('home');
			  }
			}]
		});

	$locationProvider.html5Mode(true)
  $urlRouterProvider.otherwise('home');
}]);
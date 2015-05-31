angular.module('app.controllers', []).controller('MainCtrl', ['$scope', 'posts', 'auth', function($scope, posts, auth) {
	$scope.posts = posts.posts

	$scope.isLoggedIn = auth.isLoggedIn;

	$scope.addPost = function(){
		if(!$scope.title || $scope.title === '') { return; }
  	posts.create({
    	title: $scope.title,
    	link:  $scope.link,
  	});
  	$scope.title = '';
  	$scope.link = '';
	};

	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};
}]).controller('PostsCtrl', ['$scope', 'post', 'posts', function($scope, post, posts){
	$scope.post = post;

	$scope.addComment = function(){
	  if($scope.body === '') { return; }
	  posts.addComment(post._id, { body: $scope.body, author: 'user' }).success(function(comment) {
	    $scope.post.comments.push(comment);
	  });
	  $scope.body = '';
	};

	$scope.incrementUpvotes = function(comment){
	  posts.upvoteComment(post, comment);
	};
}]).controller('NavCtrl', ['$scope', 'auth', function($scope, auth) {
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]).controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth) {
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])
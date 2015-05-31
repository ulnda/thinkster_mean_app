angular.module('app.services', []).factory('posts', ['$http', 'auth', function($http, auth) {
  var o = {
    posts: [],
		getAll: function() {
			return $http.get('/api/posts').success(function(data){
				angular.copy(data, o.posts);
			});
		},
		create: function(post) {
		  return $http.post('/api/posts', post, { 
		  	headers: { Authorization: 'Bearer '+ auth.getToken() }
		  }).success(function(data){
		    o.posts.push(data);
		  });
		},
		upvote: function(post) {
		  return $http.put('/api/posts/' + post._id + '/upvote' , null , {
		  	headers: { Authorization: 'Bearer '+auth.getToken() }
		  }).success(function(data){
		     post.upvotes += 1;
		  });
		},
		get: function(id) {
  		return $http.get('/api/posts/' + id).then(function(res){
    		return res.data;
  		});
		},
		addComment: function(id, comment) {
		  return $http.post('/api/posts/' + id + '/comments', comment, {
		  	headers: { Authorization: 'Bearer '+auth.getToken() }
		  });
		},
		upvoteComment: function(post, comment) {
		  return $http.put('/api/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
		  	headers: { Authorization: 'Bearer '+auth.getToken() }
		  }).success(function(data){
				comment.upvotes += 1;
			});
		}
	}
  return o;
}]).factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};
	
	auth.saveToken = function (token) {
	  $window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function () {
	  return $window.localStorage['flapper-news-token'];
	}

	auth.isLoggedIn = function() {
	  var token = auth.getToken();

	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } 
	  else {
	    return false;
	  }
	};

	auth.currentUser = function() {
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.username;
	  }
	};

	auth.register = function(user) {
	  return $http.post('/api/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logIn = function(user) {
	  return $http.post('/api/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logOut = function() {
  	$window.localStorage.removeItem('flapper-news-token');
	};

  return auth;
}])


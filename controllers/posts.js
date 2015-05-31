var mongoose = require('mongoose');
var Post     = mongoose.model('Post');
var Comment  = mongoose.model('Comment');

var jwt      = require('express-jwt');
var auth     = jwt({secret: 'SECRET', userProperty: 'payload'});

module.exports.controller = function(app) {
  app.get('/posts', function(req, res, next) {
    Post.find(function(err, posts){
      if(err){ return next(err); }

      res.json(posts);
    });
  });

  app.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save(function(err, post){
      if(err){ return next(err); }

      res.json(post);
    });
  });

  app.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
      if (err) { return next(err); }
      if (!post) { return next(new Error('can\'t find post')); }

      req.post = post;
      return next();
    });
  });

  app.get('/posts/:post', function(req, res) {
    req.post.populate('comments', function(err, post) {
      if (err) { return next(err); }

      res.json(post);
    });
  });

  app.put('/posts/:post/upvote', auth, function(req, res, next) {
    req.post.upvote(function(err, post){
      if (err) { return next(err); }

      res.json(post);
    });
  });

  app.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function(err, comment){
      if(err){ return next(err); }

      req.post.comments.push(comment);
      req.post.save(function(err, post) {
        if(err){ return next(err); }

        res.json(comment);
      });
    });
  });

  app.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment){
      if (err) { return next(err); }
      if (!comment) { return next(new Error('can\'t find comment')); }

      req.comment = comment;
      return next();
    });
  });

  app.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    req.comment.upvote(function(err, comment){
      if (err) { return next(err); }

      res.json(comment);
    });
  });
}

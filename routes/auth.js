// Add Passport-related auth routes here.
var express = require('express');
var router = express.Router();
var models = require('../models/models');

module.exports = function(passport) {

  router.get('/', function(req, res) {
    if(req.user) {
      res.redirect('/users/' + req.user._id)
    } else {
      res.render('index')
    }
  });

  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/', function(req, res) {
    if (!validateReq(req.body)) {
      return res.render('signup', { error: "Passwords don't match." });
    }
    User.create({
      fbid: req.body.fbid,
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      imageUrl: req.body.imageUrl,
      bio: req.body.bio
    })
    .then(function(result){
      res.json({'success': true})
      res.redirect('/login');
    })
    .catch(function(error){
      console.log('there was an error', error)
      res.json({'error': error})
    });
  });

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local'), function(req, res) {
    // res.redirect('/users/' + req.user._id);
    res.redirect('/posts');
  });

  router.get('/fb/login', passport.authenticate('facebook'));

  router.get('/fb/login/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/fail'
  }));

  router.get('/fail', function(req, res) {
    res.status(401).send('Failed to login with Facebook.');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  // router.get('/signup', function(req, res) {
  //   res.render('signup');
  // });

  return router;
};

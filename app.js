"use strict";
var express = require('express');
var app = express();
var routes = require('./routes/index');
var auth = require('./routes/auth');
var models = require('./models/models');

var handlebars = require('express-handlebars');
app.engine('hbs', handlebars({
  extname: '.hbs'
}));
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '/public')));

var cookieSession = require('cookie-session');
app.use(cookieSession({
  keys: ['my super secret key']
}));

var passport = require('passport');

var FacebookStrategy = require('passport-facebook');
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/fb/login/callback'
},
function(accessToken, refreshToken, profile, done) {
  models.User.findOrCreate({
    where: {
      fbId: profile.id,
      displayName: profile.displayName
    }
  }).spread(function(user) {
    return done(null, user);
  });
  // models.User.find({fbId: profile.id}, function(err, user) {
  //   if (err) { return done(err); }
  //   if (!user) {
  //     models.User.create({
  //       fbid: profile.id,
  //       displayName: profile.displayName,
  //     })
  //     .then(function(result){
  //       res.json({'success': true})
  //       // res.redirect('/login');
  //     })
  //     .catch(function(error){
  //       console.log('there was an error', error)
  //       res.json({'error': error})
  //     });
  //     done(null, {_id: u._id, token: accessToken, displayName: profile.displayName, fbId: profile.id});
  //   } else {
  //     console.log('IMAG?', profile)
  //     done(null, {_id: user._id, token: accessToken, displayName: profile.displayName, fbId: profile.id});
  //   }
  // });
}));
var LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(function(username, password, done){
 //find the user with the given username
 models.User.find({email: username}, function(err, user) {
   //if error, finish trying to authenticate
   if (err) {
     console.error(err);
     return done(err);
   }
   //if no user present auth failed
   if (!user) {
     console.log(user);
     return done(null, false, { message: 'Incorrect username.' });
   }
   // auth has succeeded
   return done(null, user);
 });
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
     message: err.message,
     error: err
   });
 });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
   message: err.message,
   error: {}
 });
});

module.exports = app;

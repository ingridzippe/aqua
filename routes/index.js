var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Tweet = models.Tweet;
var Event = models.Event;
var Content = models.Content;

// THE WALL - anything routes below this are protected by our passport (user must be logged in to access these routes)!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/users/', function(req, res, next) {
  // Gets all users
  User.find({}, function(err, users) {
    res.render('profiles', {allUsers: users, requser: req.user})
  })
});

// Gets all information about a single user
router.get('/users/:userId', function(req, res, next) {
  models.User.findOne({_id: req.params.userId}, function(err, user) {
    if (err) { res.json({'error': 'error'}); }
    else if (!user) { res.json({'error': 'User not found.'}); }
    User.findById({_id: req.params.userId}, function(err, user){
      if (err) { res.json({'error': 'error'}); }
      if (!user) { res.json({'error': 'User not found.'}); }
      user.getFollowRelations(function(err, peopleYouFollow, peopleWhoFollowYou) {
        Event.find({user: req.params.userId}, function(err, events){
          console.log('REQ.USERrrrr', req.user);
          res.render('singleProfile', {
            user: user,
            requser: req.user,
            peopleYouFollow: peopleYouFollow,
            peopleWhoFollowYou: peopleWhoFollowYou,
            events: events
          });
        });
      });
    })
  });
});

router.get('/posts/', function(req, res, next) {
  // Displays all tweets in the DB
  // Tweet.find({}).populate('follower').exec(function(err, peopleWhoFollowYou){
  Event.find({}, function(err, events) {
    console.log('EVENTSSSSSS', events);
    res.render('tweets', { events: events, requser: req.user })
  })
});

router.get('/contents/', function(req, res, next) {
  // Displays all tweets in the DB
  // Tweet.find({}).populate('follower').exec(function(err, peopleWhoFollowYou){
  Content.find({}, function(err, contents) {
    console.log('EVENTSSSSSS', contents);
    res.render('tweets', { contents: contents, requser: req.user })
  })
});

router.get('/posts/:tweetId', function(req, res, next) {

  //Get all information about a single tweet

});

router.get('/posts/:tweetId/likes', function(req, res, next) {

  //Should display all users who like the current tweet

});

router.post('/posts/:postId/likes', function(req, res, next) {

  //Should add the current user to the selected tweets like list (a.k.a like the tweet)

});

router.get('/post/new', function(req, res, next) {
  //Display the form to fill out for a new tweet
  console.log('GET REQ USER', req.user)
  res.render('newTweet.hbs', {user: req.user, requser: req.user});
});

router.post('/post/new', function(req, res) {
  // Handle submission of new tweet form, should add tweet to DB
  console.log('POST REQ USER', req.user)
  var event = new models.Event({
    user: req.user,
    displayName: req.user.displayName,
    eventDate: req.body.eventDate,
    eventLocation: req.body.eventLocation,
    eventDescription: req.body.eventDescription
  });
  console.log('NEW EVENT', event)
  console.log('REQ BODY', req.body)
  event.save(function(err, event) {
    if (err) {
      console.log(err);
      res.status(500).redirect('/register');
      return;
    }
    // res.redirect('/users/' + req.user._id);
    res.redirect('/posts');
  });
});

router.post('/follow/:userId', function(req, res, next) {
  // user id of current person
  // user id of person you're following
  // req.user._id is coming from passport
  // Follow.find({follower: req.user._id, following: req.params.userId},
  //     function(err, result) {
  //         if(err){
  //             res.send({'error': 'could not find'})
  //         } else {
  //             var newFollow = new Follow({
  //                 follower: req.user._id,
  //                 following: req.params.userId
  //             })
  //             newFollow.save(function(err, follow) {
  //                 if(err){
  //                     res.send({'error': 'could not save'})
  //                 } else {
  //                     res.redirect('/users/' + req.user._id);
  //                 }
  //             })
  //         }
  // })
  Follow.findOne({follower: req.user._id, following: req.params.userId},
    function(err, result) {
      if(err){
        res.send(err)
      } else {
        console.log('UNFOLLOW JUST RAN')
          if (result) {
            result.remove(function(err) {
              if (err) {
                res.status(500);
                res.json({'error': 'Did not remove token.'});
              } else {
                res.status(200);
                res.redirect('/users/' + req.params.userId)
              }
            });
          } else {
            var newFollow = new Follow({
              follower: req.user._id,
              following: req.params.userId
            })
            newFollow.save(function(err, result) {
              if(err){
                res.send(err)
              } else {
                console.log('FOLLOW JUST RAN')
                followString = 'Unfollow'
                res.redirect('/users/' + req.params.userId)
              }
            })
          }
      }
    })
  })

router.get('/allFollowers', function(req, res, next) {

})

router.get('/post/content', function(req, res, next) {
  //Display the form to fill out for a new tweet
  console.log('GET REQ USER', req.user)
  res.render('newContent.hbs', {user: req.user, requser: req.user});
});

router.post('/post/content', function(req, res) {
  // Handle submission of new tweet form, should add tweet to DB
  console.log('POST REQ USER', req.user)
  var content = new models.Content({
    user: req.user,
    displayName: req.user.displayName,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description,
    domain: req.body.domain,
    url: req.body.url,
    image: req.body.image,
  });
  console.log('NEW CONTENT', content)
  console.log("yay");
  content.save(function(err, event) {
    if (err) {
      res.status(500).redirect('/register');
      return;
    }
    // res.redirect('/users/' + req.user._id);
    res.redirect('/contents');
  });
});

// router.post('/post/content', function(req, res) {
//   console.log('POST REQ USER', req.user)
//   console.log("NEW 2")
//   console.log("req.body");
//   console.log(req.body.domain);
//   console.log(req.body.url);
//   // var event = new models.Event({
//   //   user: req.user,
//   //   displayName: req.user.displayName,
//   //   eventDate: req.body.eventDate,
//   //   eventLocation: req.body.eventLocation,
//   //   eventDescription: req.body.eventDescription
//   // });
//   // console.log('NEW EVENT', event)
//   // console.log('REQ BODY', req.body)
//   // event.save(function(err, event) {
//   //   if (err) {
//   //     console.log(err);
//   //     res.status(500).redirect('/register');
//   //     return;
//   //   }
//   //   // res.redirect('/users/' + req.user._id);
//   //   res.redirect('/posts');
//   // });
// });



module.exports = router;

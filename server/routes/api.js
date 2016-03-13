var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');


var User = require('../models/user.js');


router.post('/register', function(req, res) {
  console.log('POST: /register');
  console.log(req.body);
  var newUser = new User({ username: req.body.username, name: req.body.name, surname: req.body.surname, gender: req.body.gender});

  User.register(newUser,
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }

    console.log(req.body);
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  console.log('POST: /login');
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }

      console.log(user._id);
      var token = jwt.sign({"user": user.username}, 'superSecret', {
        expiresInMinutes: 1440 // wygasa w 24 godziny
      });
      res.status(200).json({
        status: 'Login successful!',
        token: token
    });
  })(req, res, next);
});


router.get('/logout', function(req, res) {
  console.log('GET: /logout');
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});



router.post('/check_email', function(req, res){
  console.log(req.body.username);
  User.find({username: req.body.username}, function(err, docs){
    if(err) return next(err);
    if(docs.length){
      console.log("Nieuq");
      res.send(false);
    }else{
      console.log("unique");
      res.send(true);
    }
  });


});


// UWAGA UWAGA UWAGA

// WSZYSTKO PONIŻEJ WYMAGA AUTORYZACJI UŻYTKOWNIKA!!!!!!!

router.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded){
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // jeśli wszystko jest w porządku zapisz żadianie do użycia w innych ścieżkach
        req.decoded = decoded;
        next();
      }
    });
  } else {

    // jeśli nie ma tokena
    // zwróc błąd
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});


//router.get('/api', router);


router.get('/status', function(req, res) {
  console.log('GET: /status');
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});


router.get('/basicData', function(req, res){
  User.find({username: req.decoded.user}, function(err, user){
    if(err) res.send(err);
    console.log(user);
    res.json(user);
  });
  console.log('wysyłam dane basicData');
});


module.exports = router;
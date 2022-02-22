var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

//get relevant models
var User = require("../models/User.model");
var Institutions = require("../models/Institution.model")

//config "/institution" POST, run middleware of passport for JWT auth 
router.post('/create', async function(req, res) {
    
  // check if relevant field passed in request and handel errors
  if (
    !req.body.name || 
    !req.body.password || 
    !req.body.emailAddress || 
    !req.body.role) 
  {
    res.status(400).json({success: false, msg: 'Please pass name, password, email and role.'});
  } else {

    //define user doamin and find it from 'Institutions'.
    var userDomain = req.body.emailAddress.split("@")[1]
    Institutions.findOne({emailDomain: userDomain}, (err, institution) => {
      
      //handel error on finding institution
      if (err) {
        res.status(400).json({success: false, msg: `${err}`})
      } else if (!institution) {
        res.status(400).json({success: false, msg: 'Cannot Find Institution.'})
      } else {

        //create new user
        var newUser = new User({
          name: req.body.name,
          emailAddress: req.body.emailAddress,
          role: req.body.role,
          password: req.body.password,
          Institution_id: institution._id
        });
        // save the user
        newUser.save(function(err) {

          //handel error on saving user
          if (err) {
            res.status(409).json({success: false, msg: `User already exists. ${err}`});
          } else {

            //send user created notice
            res.status(200).json({success: true, msg: 'Successful created new user.'});
          }
        });
      };
    })
  }
});
  

//config "/signin" POST, run middleware of passport for JWT auth
router.post('/signin', function(req, res) {

  //find relevant user
  User.findOne({
      emailAddress: req.body.emailAddress
  }, function(err, user) {
    if (err && !user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {

      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week
          });
          
          // return the information including token as JSON
          res.status(200).json({success: true, token: 'JWT ' + token})
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

module.exports = router;
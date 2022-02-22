var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();

//get relevant models
var Institutions = require("../models/Institution.model")


//config "/institution" GET, run middleware of passport for JWT auth 
router.get('/', passport.authenticate('jwt', { session: false}), async function(req, res) {
  
  //get user token for second check if in headers
  var token = getToken(req.headers);
  if (token) {

    // find all relevant books
    Institutions.find(function (err, institutions) {
      if (err) {
        res.status(400).json(institutions);
      } else {
        res.status(200).json({success: false, msg: `${err}`});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});



//config "/institution" POST, run middleware of passport for JWT auth 
router.post('/', passport.authenticate('jwt', { session: false}), async function(req, res) {
  
  //get user token for second check if in headers
  var token = getToken(req.headers);
  if (token) {

    //variables define && check if they passed in request
    var { name, URL, emailDomain } = req.body
    if (name && URL && emailDomain) {

      //create new institution
      const institution = new Institutions({ name, URL, emailDomain })
      
      //save institution
      institution.save(function(err) {

        //handel error while saving
        if (err) {
          return res.status(400).json({success: false, msg: 'Cannot create institution.'});
        } else {

          //return data
          res.status(200).json({success: true, msg: 'Successful created new institution.'})
        }
      })

    //handel error if relevant field didnt pass in body
    } else {
      return res.status(403).send({success: false, msg: 'please provide {name, URL, emailDomain} in body.'});
    }
    
  //handel unauthorized users
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

//get joken from request headers
getToken = function (headers) {
  if (headers && headers.authorization) {
    
    // get the token itself from "JWT {token}"
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
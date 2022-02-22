var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();

//get relevant models
var Books = require("../models/Book.model");
var Institutions = require("../models/Institution.model")



//config "/books" GET, run middleware of passport for JWT auth 
router.get('/', passport.authenticate('jwt', { session: false}), async function(req, res) {
  
  //get user && token for second check if in headers
  var token = getToken(req.headers);
  var user = req.user
  if (token && user) {

    //variables define && get users Institution_id from JWT
    var userRole = user.role //For future Use
    var userInst_id = user.Institution_id

    // find all relevant books
    Books.find({Institution_id: userInst_id }, function (err, books) {

      //handle error of not find
      if (err) {
        res.status(400).json({success: false, msg: `${err}`})
      } else {

        //return books data
        res.status(200).json(books);
      }
    });

  // handle error if cant find user or JWT
  } else {
    res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});



//config "/books" POST, run middleware of passport for JWT auth
router.post('/', passport.authenticate('jwt', { session: false}), async function(req, res) {
  
  //get user token for second check if in headers
  var token = getToken(req.headers);
  if (token) {

    //variables define && get Institution_id from user connected
    var { Institution_id } = req.body
    var institution = await Institutions.findOne({_id: Institution_id})
    var Inst_id = institution._id

    if (institution) {

      //create new book
      const book = new Books({
        ISBN: req.body.ISBN, 
        title: req.body.title, 
        author: req.body.author, 
        Institution_id: Inst_id
      })

      //save book
      book.save(function(err) {
        
        // handle error on save
        if (err) {
          res.status(400).json({success: false, msg: `Cannot create book, ${err}`});
        } else {
          res.status(200).json({success: true, msg: 'Successful created new book.'})
        }
      })

    // handle error if cant find institution
    } else {
      return res.status(400).send({success: false, msg: 'Cannot find relevant institution.'});
    }

  // handle error if not authorized
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
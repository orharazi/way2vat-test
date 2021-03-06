const mongoose = require("mongoose")
const { Schema } = mongoose;
var bcrypt = require('bcrypt-nodejs');


const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "academic", "administrator"],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  Institution_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institutions',
    required: true
  }
}, {timestamps: true})

userSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
      bcrypt.genSalt(10, function (err, salt) {
          if (err) {
              return next(err);
          }
          bcrypt.hash(user.password, salt, null, function (err, hash) {
              if (err) {
                  return next(err);
              }
              user.password = hash;
              next();
          });
      });
  } else {
      return next();
  }
});

userSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err) {
          return cb(err);
      }
      cb(null, isMatch);
  });
};

module.exports = mongoose.model('Users', userSchema);
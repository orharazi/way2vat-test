const mongoose = require("mongoose")
const { Schema } = mongoose;


const InstitutionSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  URL: {
    type: String,
    unique: true,
    required: true
  },
  emailDomain: {
    type: String,
    unique: true,
    required: true
  },
}, {timestamps: true})

module.exports = mongoose.model('Institutions', InstitutionSchema);
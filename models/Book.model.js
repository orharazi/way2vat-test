const mongoose = require("mongoose")
const { Schema } = mongoose;


const bookSchema = new Schema({
  ISBN: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  Institution_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institutions',
    required: true
  }
}, {timestamps: true})

module.exports = mongoose.model('books', bookSchema);
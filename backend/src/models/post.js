const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const post = mongoose.model("post", postSchema);

module.exports = post;

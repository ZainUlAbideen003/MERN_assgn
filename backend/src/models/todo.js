const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema({
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
  date: {
    type: Date,
    default: Date.now
  }
});

const todo = mongoose.model("todo", todoSchema);

module.exports = todo;

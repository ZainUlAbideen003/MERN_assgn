const mongoose = require("mongoose");
const { Schema } = mongoose;

const imgSchema = new Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const uimg = mongoose.model("userImg", imgSchema);

module.exports = uimg;

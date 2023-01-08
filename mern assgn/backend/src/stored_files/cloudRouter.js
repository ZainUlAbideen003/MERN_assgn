const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//
const cloudinary = require("cloudinary").v2;
//
const post = require("../models/post");
const User = require("../models/user");
//
const userauth = require("../middleware/userauth");
//

router.get("/cloudupload", (req, res) => {
  //working

  // cloudinary.uploader
  //   .upload("./media/template3.webp", {
  //     use_filename: true,
  //     unique_filename: false,
  //     folder: "data"
  //   })
  //   .then((result) => console.log(result))
  //   .catch((e) => console.log("error occurred", e));
  // //
  // res.send("got the cloud");
  cloudinary.uploader
    .upload("./upload/03ae36b6ea0921bfb634553227587a84", {
      use_filename: true,
      unique_filename: false,
      folder: "data"
    })
    .then((result) => console.log(result))
    .catch((e) => console.log("error occurred", e));
  //
  res.send("got the cloud");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//
const User = require("../models/user");
//
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const API_KEY = "123";
const userauth = require("../middleware/userauth");
//
let newuserArray = [
  body("name", "Length of name should not be less than 3").isLength({ min: 3 }),
  body("email", "Enter your email address").isEmail(),
  body("password", "Password length should be >= 5").isLength({ min: 5 }),
  body("cpassword")
    .exists({ checkFalsy: true })
    .withMessage("You must type a confirmation password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords do not match")
];

router.post("/newuser", newuserArray, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  //
  let check = await User.findOne({ email: req.body.email });
  //
  if (check) {
    return res.status(404).json({ msg: "user already exists" });
  }
  //generating salted and hashed password
  let salt = await bcrypt.genSalt(10);
  let hashPass = await bcrypt.hash(req.body.password, salt);
  try {
    let result = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPass
    });
    res.status(200).json({ msg: "User is created", result: result });
  } catch (e) {
    res.status(400).json({ msg: "Error ocurred", error: e });
  }
});

let loginuserArray = [
  body("email", "Please login with correct email address").isEmail(),
  body("password").exists()
];
router.post("/loginuser", loginuserArray, async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(400).json({ msg: "user does not exists!!!" });
    }
    let existingPass = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (existingPass) {
      let obj = {
        id: existingUser.id
      };
      let logintoken = jwt.sign(obj, API_KEY);
      //
      //generating data for the sidebar display
      const { name, email, date } = existingUser;
      let logindate = new Date();
      //
      let ownerObj = {
        name,
        email,
        createAt: date.toUTCString(),
        loginAt: logindate.toUTCString()
      };
      // res.status(200).json({ msg: "password matched", token: logintoken });
      res.status(200).json({
        msg: "password matched",
        ownerObj,
        token: logintoken
      });
    } else {
      res.status(400).json({ msg: "password does not matched!!!" });
    }
  } catch (e) {
    res.status(400).json({ msg: "error occurred", error: e });
  }
});
////////////////////////////

let updateUserArray = [
  body("name", "Length of name should not be less than 3 char").isLength({
    min: 3
  }),
  body("email", "Enter your email address").isEmail(),
  body("npassword", "New password length should be >= 5 char").isLength({
    min: 5
  }),
  body("cpassword")
    .exists({ checkFalsy: true })
    .withMessage("You must type a confirmation password")
    .custom((value, { req }) => value === req.body.npassword)
    .withMessage("The passwords do not match")
];
//updating user
router.post("/updateuser", userauth, updateUserArray, async (req, res) => {
  let uid = req.data.id;
  //
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  //
  console.log("req.body.opassword,", req.body.opassword);
  try {
    //checking old fields
    let existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(400).json({ msg: "user does not exists!!!" });
    }
    //checking password
    let existingPass = await bcrypt.compare(
      req.body.opassword,
      existingUser.password
    );
    //
    console.log("exsitingpassword", existingPass);
    if (!existingPass) {
      return res.status(400).json({ msg: "Old password does not match!!!" });
    }
    //
    console.log("existingUser=>", existingUser);
    //
    let salt = await bcrypt.genSalt(10);
    let hashPass = await bcrypt.hash(req.body.npassword, salt);
    //
    let newUserdata = {
      name: req.body.name,
      email: req.body.email,
      password: hashPass
    };

    //updating the field
    try {
      let result = await User.findByIdAndUpdate(
        uid,
        { $set: newUserdata },
        { new: true }
      );
      res
        .status(200)
        .json({ msg: "User data has been updated.", result: result });
    } catch (e) {
      res.status(400).json({ msg: "error occurred in updating User data." });
    }
    //till update
  } catch (e) {
    res.status(400).json({ msg: "error occurred in updating note", error: e });
  }
  //
});

module.exports = router;

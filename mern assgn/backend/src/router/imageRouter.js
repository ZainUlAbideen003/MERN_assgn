const express = require("express");
const router = express.Router();
//
const multer = require("multer");
const upload = multer({ dest: "upload/" });
//
const cloudinary = require("cloudinary").v2;
//
//middlware
const userauth = require("../middleware/userauth");
//schemaCollection
const User = require("../models/user");
//
//uploading image
router.post("/uploadImg", userauth, upload.single("img"), async (req, res) => {
  let uid = req.data.id;
  console.log("uid=>", uid);
  // console.log("req.file=>", req.file);
  const { originalname, filename, path } = req.file;
  console.log(originalname, filename, path);
  if (!req.file) return res.json({ msg: "error in getting img" });
  //
  try {
    //generating cloudinary Url
    let uploadedImg = await cloudinary.uploader.upload(`${path}`, {
      use_filename: true,
      unique_filename: false,
      folder: "data"
    });
    //updating User and putting url and name of the image in User data
    let newObj = {
      imgName: req.file.originalname,
      imgUrl: uploadedImg.url
    };
    User.findOneAndUpdate({ _id: uid }, newObj)
      .then((resp) => console.log("updated"))
      .catch((e) => console.log("error in updating image"));
    //user response
    res.status(200).json({ msg: "got the img", data: req.file });
  } catch (e) {
    console.log("error occurred in cloudinary uploading.", e);
  }
  //
});

//reading image
router.get("/readImg", userauth, async (req, res) => {
  const uid = req.data.id;
  const userdata = await User.findOne({ _id: uid });
  console.log("userdata", userdata);
  res.json(userdata.imgUrl);
});

module.exports = router;

// //reading All images
// router.get("/readAllImgs", userauth, async (req, res) => {
//   const uid = req.data.id;
//   uimg
//     .find()
//     .populate("id")
//     .exec(function (err, result) {
//       if (err) console.log("error in reading all iamges with users");
//       res.json({ msg: "all data has been read.", data: result });
//     });
// }); //

// //reading image
// router.get("/readImg", userauth, async (req, res) => {
//   const uid = req.data.id;
//   const imgdata = await uimg.find({ id: uid });
//   console.log("imgdata", imgdata[0].imgUrl);
//   res.json(imgdata[0].imgUrl);
// });

// //reading All images
// router.get("/readAllImgs", userauth, async (req, res) => {
//   const uid = req.data.id;
//   uimg
//     .find()
//     .populate("id")
//     .exec(function (err, result) {
//       if (err) console.log("error in reading all iamges with users");
//       res.json({ msg: "all data has been read.", data: result });
//     });
// }); //

// //uploading image
// router.post("/uploadImg", userauth, upload.single("img"), async (req, res) => {
//   let uid = req.data.id;
//   console.log("uid=>", uid);
//   // console.log("req.file=>", req.file);
//   const { originalname, filename, path } = req.file;
//   console.log(originalname, filename, path);
//   if (!req.file) return res.json({ msg: "error in getting img" });
//   //
//   try {
//     let uploadedImg = await cloudinary.uploader.upload(`${path}`, {
//       use_filename: true,
//       unique_filename: false,
//       folder: "data"
//     });
//     // console.log(uploadedImg);
//     //checking if owner has already any images, so that we can add only one image of owner, in case of exising beforehand, just update the image
//     let existingImg = await uimg.find({ id: uid });
//     console.log("existingImg", existingImg);
//     if (Object.keys(existingImg).length !== 0) {
//       console.log("already exists then updating it");
//       //
//       let imgobj = {
//         id: uid,
//         name: originalname,
//         imgUrl: uploadedImg.url
//       };
//       uimg
//         .updateOne({ id: uid }, { $set: imgobj })
//         .then((resp) => console.log("updated succesfully"))
//         .catch((e) =>
//           console.log("error ocurred in updating the image in DB.")
//         );
//     } else {
//       console.log("does not exists then creating it");
//       let newImg = {
//         id: uid,
//         name: originalname,
//         imgUrl: uploadedImg.url
//       };
//       //
//       uimg
//         .create(newImg)
//         .then((resp) => console.log("img is saved in DB"))
//         .catch((e) => console.log("error in saving img in DB", e));
//       //
//     }
//     //
//     res.status(200).json({ msg: "got the img", data: req.file });
//   } catch (e) {
//     console.log("error occurred in cloudinary uploading.", e);
//   }
//   //
// });

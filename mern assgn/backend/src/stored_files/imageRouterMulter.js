const express = require("express");
const router = express.Router();
//
const multer = require("multer");
const upload = multer({ dest: "upload/" });
//
const fs = require("fs");
const path = require("path");
//
//middlware
const userauth = require("../middleware/userauth");
//schemaCollection
const uimg = require("../models/image");
//
const User = require("../models/user");
const post = require("../models/post");
//userauth,

//uploading image
router.post("/img", userauth, upload.single("img"), async (req, res) => {
  let uid = req.data.id;
  console.log("uid=>", uid);
  console.log("req.file=>", req.file);
  if (!req.file) res.json({ msg: "error in getting img" });
  else {
    let filedata = fs.readFileSync(
      path.join(__dirname, `../../upload/${req.file.filename}`)
    );
    // console.log("filedata=>", filedata);
    let existingImg = await uimg.find({ id: uid });
    //to avoid multiple image for being saved in DB for one user(onde id)
    //if exists already then update it
    if (Object.keys(existingImg).length !== 0) {
      console.log(
        "Same Id Image already exists...",
        Object.keys(existingImg).length
      );
      let newImage = {
        id: uid,
        name: req.file.originalname
        // imgUrl:
      };
      try {
        // await uimg.updateOne({ id: uid }, { $set: { newImage } });
        await uimg.updateOne({ id: uid }, { $set: newImage });
        console.log("updated successfully");
      } catch (e) {
        console.log("error occurred in updating note");
      }
      //otherwise create new one
    } else {
      console.log("New Image Id", Object.keys(existingImg).length);
      const imgSave = uimg({
        id: uid,
        name: req.file.originalname,
        img: {
          data: filedata,
          contentType: req.file.mimetype
        }
      });
      imgSave
        .save()
        .then((resp) => console.log("img is saved"))
        .catch((e) => console.log("error in saving img", e));
    }
    //
    //
    res.status(200).json({ msg: "got the img", data: req.file });
  }
});

// //reading image
// router.get("/readimg", userauth, async (req, res) => {
//   const uid = req.data.id;
//   // const bufferString = await uimg.find({ id: uid }).sort({ date: -1 });
//   const bufferString = await uimg.find({ id: uid });
//   // res.json({ msg: "image has been read", data: bufferString });
//   res.json(bufferString);
// });

// // router.get("/readallimg", userauth, async (req, res) => {
// //   const uid = req.data.id;
// // //
// // User.aggregate([
// //   {
// //     $lookup: {
// //       from: "uimg",
// //       localField: "_id",
// //       foreignField: "id",
// //       as: "joined"
// //     }
// //   },
// //   {
// //     $project: {
// //       _id: 1,
// //       name: 1,
// //       email: 1,
// //       joined: "$joined"
// //     }
// //   }
// // ])
// //   .then((resp) => res.send(resp))
// //   .catch((e) => res.send(e));

// //
// // User.aggregate([
// //   {
// //     $lookup: {
// //       from: "post",
// //       as: "joined",
// //       let: { user_id: "$_id" },
// //       pipeline: [{ $match: { $expr: { $eq: ["$user_id", "$id"] } } }]
// //     }
// //   },
// //   {
// //     $project: {
// //       _id: 1,
// //       name: 1,
// //       email: 1,
// //       joined: 1
// //     }
// //   }
// // ]).exec((err, result) => {
// // if (err) {
// //   res.send(err);
// // }
// // if (result) {
// //   res.send({ error: false, data: result });
// // }
// // });
// // });
// ///////////////////////////
// // uimg
// // // .findOne({ id: uid })
// // .find()
// // .populate("id")
// // .exec(function (err, result) {
// //   if (err) {
// //     res.send(err);
// //   }
// //   if (result) {
// //     res.send({ error: false, data: result });
// //   }
// // });

// //userauth,
// router.get("/readallimg", async (req, res) => {
//   uimg
//     // .findOne({ id: uid })
//     .find()
//     .populate("id")
//     .exec(function (err, result) {
//       if (err) {
//         res.send(err);
//       }
//       if (result) {
//         res.send({ error: false, data: result });
//       }
//     });
//   //
// });

module.exports = router;

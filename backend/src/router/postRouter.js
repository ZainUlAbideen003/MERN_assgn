const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//
const post = require("../models/post");
const User = require("../models/user");
//
const userauth = require("../middleware/userauth");
//
let createpostArray = [
  body("title", "Title length should not be less than 3 characters").isLength({
    min: 3
  }),
  body(
    "description",
    "Description length should not be less than 5 characters"
  ).isLength({
    min: 5
  })
];

router.post("/createpost", userauth, createpostArray, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  let { title, description, topic } = req.body;
  let uid = req.data.id;
  //for finding name of poster
  //
  try {
    await post.create({
      id: uid,
      title,
      description,
      topic
    });
    //reading all posts by everyone
    post
      .find()
      .sort({ date: -1 })
      .populate("id")
      .exec(function (err, result) {
        if (err)
          res
            .status(400)
            .json({ msg: "error occurred in creating a post.", error: err });
        res.status(200).json({ msg: "Post has been added.", result: result });
      });
    //
  } catch (e) {
    res.status(400).json({ msg: "error occurred in creating post", error: e });
  }
  //end
});

router.get("/readpost", userauth, async (req, res) => {
  // let ownerPosts = await post.find({ id: req.data.id }).sort({ date: -1 });
  post
    .find()
    .sort({ date: -1 })
    .populate("id")
    .exec(function (err, result) {
      if (err)
        res
          .status(400)
          .json({ msg: "error occurred in reading all post", error: err });
      res.status(200).json({ msg: "All Post has been read.", result: result });
    });

  //end
});

module.exports = router;

// router.get("/readpost", userauth, async (req, res) => {
//   try {
//     //reading all posts by everyone
//     // let ownerPosts = await post.find({ id: req.data.id }).sort({ date: -1 });
//     let allPosts = await post.find().sort({ date: -1 });
//     //sending response
//     res.status(200).json({
//       msg: "All Post has been read.",
//       result: allPosts
//     });
//   } catch (e) {
//     res
//       .status(400)
//       .json({ msg: "error occurred in reading all post", error: e });
//   }
//   //end
// });

// router.get("/readPostwithImage", userauth, async (req, res) => {
//   const uid = req.data.id;
//   //
//   // post
//   //   .aggregate([
//   //     {
//   //       $lookup: {
//   //         from: User.collection.name,
//   //         localField: "id",
//   //         foreignField: "_id",
//   //         as: "joined"
//   //       }
//   //     }
//   //   ])
//   //   .exec(function (err, result) {
//   //     if (err) res.send(err);
//   //     res.send(result);
//   //   });
//   console.log("User.collection.name", image.collection.name);
//   post
//     .aggregate([
//       {
//         $lookup: {
//           from: User.collection.name,
//           localField: "id",
//           foreignField: "_id",
//           as: "joined"
//         }
//         // $project:{

//         // }
//       }
//     ])
//     .exec(function (err, result) {
//       if (err) res.send(err);
//       res.send(result);
//     });

//   //
// }); //

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//
const todo = require("../models/todo");
const userauth = require("../middleware/userauth");
//
let createnoteArray = [
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
router.post("/createTask", userauth, createnoteArray, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  let { title, description } = req.body;
  try {
    let result = await todo.create({
      id: req.data.id,
      title: title,
      description: description
    });
    //reading all task
    let allTasks = await todo.find({ id: req.data.id }).sort({ date: -1 });
    res.status(200).json({ msg: "Note has been added.", result: allTasks });
    // res.status(200).json({ msg: "Note has been read.", result: result });
    //
  } catch (e) {
    res.status(400).json({ msg: "error occurred in creating note", error: e });
  }
});

router.get("/readTask", userauth, async (req, res) => {
  try {
    // let result = await todo.find({ id: req.data.id });
    let result = await todo.find({ id: req.data.id }).sort({ date: -1 });
    res.status(200).json({ msg: "Note has been read.", result: result });
  } catch (e) {
    res.status(400).json({ msg: "error occurred in reading note", error: e });
  }
});
//updating tasks
let updatenoteArray = [
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
router.put("/updateTask/:id", userauth, updatenoteArray, async (req, res) => {
  //
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  //
  const { title, description } = req.body;
  let newNote = {};
  if (title) {
    newNote["title"] = title;
  }
  if (description) {
    newNote["description"] = description;
  }
  //checking if its owner
  let owner = await todo.findById(req.params.id);
  if (owner.id.toString() !== req.data.id) {
    return res
      .status(401)
      .send("Not anyone except owner is allowed to updated it.");
  }
  //
  try {
    //updating the field
    let result = await todo.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    // let result = await todo.update({ id: req.data.id }, newObj);
    let allTasks = await todo.find({ id: req.data.id }).sort({ date: -1 });
    res.status(200).json({ msg: "Note has been updated.", result: allTasks });
    // res.status(200).json({ msg: "Note has been updated.", result: result });
  } catch (e) {
    res.status(400).json({ msg: "error occurred in updating note", error: e });
  }
});

router.delete("/deleteTask/:id", userauth, async (req, res) => {
  //checking if its owner
  let owner = await todo.findById(req.params.id);
  if (owner.id.toString() !== req.data.id) {
    return res
      .status(401)
      .json({ msg: "Not anyone except owner is allowed to delete it." });
  }
  //
  try {
    //updating the field
    let result = await todo.findByIdAndDelete(req.params.id);
    // let result = await todo.update({ id: req.data.id }, newObj);
    let allTasks = await todo.find({ id: req.data.id }).sort({ date: -1 });
    res.status(200).json({ msg: "Note has been deleted.", result: allTasks });
    // res.status(200).json({ msg: "Note has been deleted.", result: result });
  } catch (e) {
    res.status(400).json({ msg: "error occurred in deleting note", error: e });
  }
});

module.exports = router;

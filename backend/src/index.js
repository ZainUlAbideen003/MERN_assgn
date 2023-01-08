const express = require("express");
const connectMongo = require("./db");
const connectCloudinary = require("./cloudinary");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
const cors = require("cors");
//origin: ["https://1klyom.csb.app/", "https://www.google.com/"]
app.use(
  cors({
    origin: "*"
  })
);
app.use(cors());
require("dotenv").config();
//
//Connecting mongodb
connectMongo();
//Connecting cloudinary
connectCloudinary();
//
console.log("ok");
//
app.get("/", (req, res) => {
  res.status(200).send("ok root connected...");
});

//registration of the userRouter
app.use(require("./router/userRouter"));
//registration of the todoRouter
app.use(require("./router/todoRouter"));
//registration of the imageRouter
app.use(require("./router/imageRouter"));
//registration of the postRouter
app.use(require("./router/postRouter"));
//listening hits at server
app.listen(8080, () => {
  console.log("Server is running at port 8080");
});

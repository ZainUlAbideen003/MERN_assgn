const cloudinary = require("cloudinary").v2;

let connectCloudinary = () => {
  cloudinary.config({
    cloud_name: "dc8f8buld",
    api_key: "551224232293763",
    api_secret: "c9KexCfSztQQGK4w7hbLpV6MhtY",
    secure: true
  });
};

module.exports = connectCloudinary;

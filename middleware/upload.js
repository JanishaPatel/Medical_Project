const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        path.parse(file.originalname).name +
          "_" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
}).any("photo");

module.exports = upload;

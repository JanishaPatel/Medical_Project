const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose.set("strictQuery", false);
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoute = require("./routes/userRoute");
const medicalRoute = require("./routes/medicalProductRoute");

const DB=process.env.MONGODB_CONNECTION;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log("Connection failed");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

app.use("/user_api", userRoute);
app.use("/medicalproduct_api", medicalRoute);

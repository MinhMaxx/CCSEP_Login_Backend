const express = require("express");
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config/dbConfig");
const app = express();

//MongoDB setup
mongoose.set("useCreateIndex", true);
mongoose
  .connect(config.database, { useNewUrlParser: true })
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log({ database_error: err });
  });

//App setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  console.log("Server starting");
});

//Assign route
const routes = require("./api/route/route");
app.use("/", routes);
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
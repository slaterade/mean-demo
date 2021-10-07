const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

const { MONGO_ATLAS_USER, MONGO_ATLAS_PASS } = require("./config");

mongoose
  .connect(
    "mongodb+srv://" +
      MONGO_ATLAS_USER +
      ":" +
      MONGO_ATLAS_PASS +
      "@cluster0.otwwp.mongodb.net/meangreen?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database.");
  })
  .catch(() => {
    console.log("Failed to connect database.");
  });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/images", express.static(path.join("images")));

// allow RESTful API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

const { MONGO_ATLAS_USER, MONGO_ATLAS_PASS, MONGO_ATLAS_DBNAME, FRONTEND_PATH } = require("./config");

mongoose
  .connect(
    "mongodb+srv://" +
      MONGO_ATLAS_USER +
      ":" +
      MONGO_ATLAS_PASS +
      "@cluster0.otwwp.mongodb.net/" +
      MONGO_ATLAS_DBNAME +
      "?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log('Connected to database "' + MONGO_ATLAS_DBNAME + '"');
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
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, FRONTEND_PATH)));

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
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, FRONTEND_PATH, "index.html"));
});

module.exports = app;

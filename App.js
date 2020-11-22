const express = require("express");
const app = express();

const Database = require("./Utils/database");
const ApiDocs = require("./ApiDocs.json");
const authRoutes = require("./Routes/userRoutes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Handeling CORS Errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.status(200).json({});
  }
  next();
});

app.use("/auth", authRoutes);

//Error Handeling Function
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error!",
  });
});

//If no Route is Found
app.use("/", (req, res) => {
  res.status(200).json({
    message: "Api is Online!",
    availableRoutes: ApiDocs,
  });
});

Database.connectDB(() => {
  app.listen(9000);
});

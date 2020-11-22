const express = require("express");
const Router = express.Router();
const userController = require("../Controllers/userController");

//Function to validate the request Body
const Validate = require("../Utils/Validation/Validation");

//Token Varification
const isAuth = require("../Utils/Validation/Authentication");

//Rules for request body validation
const {
  createUserRules,
  loginUserRules,
  getallpostsRules,
} = require("../Utils/Validation/UserValidationRules");

//Route for signup user
Router.post(
  "/createUser",
  createUserRules,
  Validate,
  userController.createUser
);

//Route for User Login
Router.post("/loginUser", loginUserRules, Validate, userController.loginUser);

//Route for getting sample posts to show in desktop
Router.post(
  "/getallpost",
  isAuth,
  getallpostsRules,
  Validate,
  userController.getAllPost
);

module.exports = Router;

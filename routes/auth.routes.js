const app = require("express").Router();
const authControllers = require("../controllers/auth.controllers");
const { check, body } = require('express-validator');


app.get("/login", authControllers.getLogin);
app.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authControllers.postLogin
);

app.post('/logout', authControllers.postLogout)
module.exports = app;

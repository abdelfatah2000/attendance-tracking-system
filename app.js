const express = require("express");
const csrf = require("csurf");
const connection = require("./config/db");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const api = require("express").Router();

const errorController = require("./controllers/error");
const User = require("./models/user.model");

const app = express();

const store = new MongoDBStore({
  uri: process.env.CONNECTION_STRING,
  databaseName: "ATMS",
  collection: "sessions",
});

connection();

const csrfProtection = csrf();

app.set("view engine", "ejs");

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(expressLayouts);

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user;
  next();
});
app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

const adminRoute = require("./routes/admin.routes");
const authRoute = require("./routes/auth.routes");
const hodRoute = require("./routes/hod.routes")

app.use(authRoute);
app.use("/admin", adminRoute);
app.use("/hod", hodRoute);

// app.get('/500', errorController.get500);

// app.use(errorController.get404);

// app.use((error, req, res, next) => {

//   res.status(500).render('500', {
//     layout:false,
//     pageTitle: 'Error!',
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn
//   });
// });

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});

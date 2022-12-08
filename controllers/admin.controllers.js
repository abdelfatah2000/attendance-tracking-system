const User = require("../models/user.model");
const Department = require("../models/department.model");
const { validationResult } = require("express-validator");

exports.getAddEmployee = (req, res, next) => {
  Department.find({}).then((departments) => {
    res.render("admin/add-employee", {
      departments: departments,
      username: req.session.user.username,
      pageTitle: "Add Employee",
      path: "/admin/add-employee",
      hasError: false,
      post: false,
      validationErrors: [],
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        department: req.body.department,
      },
    });
  });
};

exports.postAddEmployee = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("/admin/add-user", {
      hasError: true,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        department: req.body.department,
        phone: req.body.phone,
      },
      validationErrors: errors.array(),
    });
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: "Employee",
    phone: req.body.phone,
    
  });
  user
    .save()
    .then((result) => {
      condition = { _id: req.body.department };
      update = {
        $push: {
          employees: user._id,
        },
      };
      Department.findOneAndUpdate(condition, update, { new: true }).then(
        (res) => {
          console.log("Employee Added to His Department");
        }
      );
      console.log("Employee Created"), res.redirect("/admin/add-employee");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddHOD = (req, res, next) => {
  res.render("admin/add-hod", {
    username: req.session.user.username,
    pageTitle: "Add Head of Department",
    path: "/admin/add-hod",
    hasError: false,
    post: false,
    validationErrors: [],
    oldInput: {
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      phone: req.body.phone,
    },
  });
};

exports.postAddHOD = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("/admin/add-hod", {
      hasError: true,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        phone: req.body.phone,
      },
      validationErrors: errors.array(),
    });
  }
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: "HOD",
    phone: req.body.phone,
  });
  user
    .save()
    .then((result) => {
      console.log("User Created"), res.redirect("/admin/add-hod");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddDepartment = (req, res, next) => {
  User.find({ role: "HOD" }).then((users) => {
    res.render("admin/add-department", {
      users: users,
      username: req.session.user.username,
      pageTitle: "Add Department",
      path: "/admin/add-department",
      hasError: false,
      post: false,
      validationErrors: [],
      oldInput: {
        department: req.body.department,
        hod: req.body.hod,
      },
    });
  });
};

exports.postAddDepartment = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(422).render("/admin/add-department", {
      hasError: true,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        department: req.body.department,
        hod: req.body.hod,
      },
      validationErrors: errors.array(),
    });
  }
  const department = new Department({
    title: req.body.title,
    hod: req.body.hod,
  });
  department
    .save()
    .then((result) => {
      console.log("Department Added"), res.redirect("/admin/add-department");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

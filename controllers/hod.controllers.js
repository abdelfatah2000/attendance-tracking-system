const User = require("../models/user.model");
const Department = require("../models/department.model");
const Attendance = require("../models/attendance.model");
const LeavingRequest = require("../models/leavingRequest.model");
const { validationResult } = require("express-validator");

exports.getAddEmployee = (req, res, next) => {
  Department.find({ hod: req.session.user._id }).then((departments) => {
    res.render("hod/add-employee", {
      departments: departments,
      username: req.session.user.username,
      pageTitle: "Add Employee",
      path: "/hod/add-employee",
      hasError: false,
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
    return res.status(422).render("/hof/add-employee", {
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
    department: req.body.department,
  });
  user
    .save()
    .then((result) => {
      console.log("Employee Created"), res.redirect("/hod/add-employee");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getManageEmployee = (req, res, next) => {
  Department.find({ hod: req.session.user._id })
    .distinct("_id")
    .then((department) => {
      User.find({ role: "Employee", department: { $in: department } })
        .populate("department")
        .then((employees) => {
          res.render("hod/manage-employee", {
            employees: employees,
            username: req.session.user.username,
            pageTitle: "Manage Employee",
            path: "/hod/manage-employee",
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditEmployee = (req, res, next) => {
  User.findById(req.params.employeeId)
    .then((emp) => {
      Department.find({ hod: req.session.user._id })
        .then((department) => {
          res.render("hod/edit-employee", {
            pageTitle: "Edit Employee",
            path: "/hod/manage-employee",
            emp: emp,
            departments: department,
            username: req.session.user.username,
            validationErrors: [],
            hasError: false,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditEmployee = (req, res, next) => {
  const empId = req.body.empId;
  const username = req.body.username;
  const phone = req.body.phone;
  const department = req.body.department;
  const email = req.body.email;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("hod/edit-employee", {
      username: req.session.user.username,
      pageTitle: "Edit Employee",
      path: "/hod/edit-employee",
      hasError: true,
      employee: {
        _id: empId,
        username: username,
        phone: phone,
        email: email,
        department: department,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  User.findById(empId)
    .then((emp) => {
      emp.email = email;
      emp.username = username;
      emp.phone = phone;
      emp.department = department;
      return emp.save().then((result) => {
        console.log("Employee Updated"), res.redirect("/hod/manage-employee");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteEmployee = (req, res, next) => {
  const empId = req.body.empId;
  User.findByIdAndRemove(empId)
    .then((result) => {
      console.log("Employee Deleted");
      res.redirect("/hod/manage-employee");
    })
    .catch((err) => console.log(err));
};

exports.getViewAttendance = (req, res, next) => {
  Department.find({ hod: req.session.user._id })
    .then((dep) => {
      res.render("hod/view-attendance", {
        departments: dep,
        username: req.session.user.username,
        pageTitle: "View Attendance",
        path: "/hod/view-attendance",
        hasError: false,
        validationErrors: [],
        oldInput: {
          department: req.body.department,
        },
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postViewAttendance = (req, res, next) => {
  const department = req.body.department;
  Attendance.find({ department: department })
    .populate("user", "username")
    .then((attendance) => {
      res.json(attendance);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getLeavingRequest = (req, res, next) => {
  Department.find({ hod: req.session.user._id })
    .distinct("_id")
    .then((department) => {
      LeavingRequest.find({ department: { $in: department } })
        .populate({
          path: "user",
          populate: {
            path: "department",
            model: "department",
          },
        })
        .then((data) => {
          res.render("hod/leaving-requests", {
            pageTitle: "Leaving Request",
            path: "/hod/leaving-request",
            data: data,
            username: req.session.user.username,
            validationErrors: [],
            hasError: false,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    });
};

exports.approveLeavingRequest = (req, res, next) => {
  const reqId = req.params.reqId;
  LeavingRequest.findOne({ _id: reqId })
    .then((data) => {
      data.status = 1;
      data
        .save()
        .then((result) => {
          console.log("Leaving Request Approved"),
            res.redirect("/hod/leaving-request");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.rejectLeavingRequest = (req, res, next) => {
  const reqId = req.params.reqId;
  LeavingRequest.findOne({ _id: reqId })
    .then((data) => {
      data.status = 0;
      data
        .save()
        .then((result) => {
          console.log("Leaving Request Rejected"),
            res.redirect("/hod/leaving-request");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

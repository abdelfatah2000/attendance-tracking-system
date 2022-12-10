const User = require("../models/user.model");
const Department = require("../models/department.model");
const Attendance = require("../models/attendance.model");
const LeavingRequest = require("../models/leavingRequest.model");
const { validationResult } = require("express-validator");

exports.getAddEmployee = (req, res, next) => {
  Department.find({}).then((departments) => {
    res.render("admin/add-employee", {
      departments: departments,
      username: req.session.user.username,
      pageTitle: "Add Employee",
      path: "/admin/add-employee",
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
    department: req.body.department,
  });
  user
    .save()
    .then((result) => {
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

exports.getManageEmployee = (req, res, next) => {
  User.find({ role: "Employee" })
    .populate("department")
    .then((employees) => {
      res.render("admin/manage-employee", {
        employees: employees,
        username: req.session.user.username,
        pageTitle: "Manage Employee",
        path: "/admin/manage-employee",
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
      Department.find({})
        .then((department) => {
          res.render("admin/edit-employee", {
            pageTitle: "Edit Employee",
            path: "/admin/manage-employee",
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
    return res.status(422).render("admin/edit-employee", {
      username: req.session.user.username,
      pageTitle: "Edit Employee",
      path: "/admin/edit-employee",
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
        console.log("Employee Updated"), res.redirect("/admin/manage-employee");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getManageHOD = (req, res, next) => {
  User.find({ role: "HOD" })
    .then((hod) => {
      res.render("admin/manage-hod", {
        hods: hod,
        username: req.session.user.username,
        pageTitle: "Manage Head of Departments",
        path: "/admin/manage-hod",
        hasError: false,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditHOD = (req, res, next) => {
  User.findById(req.params.hodId)
    .then((hod) => {
      res.render("admin/edit-hod", {
        hod: hod,
        username: req.session.user.username,
        pageTitle: "Manage Head of Departments",
        path: "/admin/manage-hod",
        validationErrors: [],
        hasError: false,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditHOD = (req, res, next) => {
  const hodId = req.body.hodId;
  const username = req.body.username;
  const phone = req.body.phone;
  const department = req.body.department;
  const email = req.body.email;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-employee", {
      username: req.session.user.username,
      pageTitle: "Edit Head of Department",
      path: "/admin/edit-employee",
      hasError: true,
      employee: {
        _id: hodId,
        username: username,
        phone: phone,
        email: email,
        department: department,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  User.findById(hodId)
    .then((hod) => {
      hod.email = email;
      hod.username = username;
      hod.phone = phone;
      return hod.save().then((result) => {
        console.log("HOD Updated"), res.redirect("/admin/manage-hod");
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
      res.redirect("/admin/manage-employee");
    })
    .catch((err) => console.log(err));
};

exports.deleteHOD = (req, res, next) => {
  const hodId = req.body.hodId;
  Department.find({ hod: hodId }).then((dep) => {
    if (dep.length > 0) {
      return res.redirect("/admin/manage-hod");
    } else {
      User.findByIdAndRemove(hodId)
        .then((result) => {
          console.log("HOD Deleted");
          res.redirect("/admin/manage-hod");
        })
        .catch((err) => console.log(err));
    }
  });
};

exports.getManageDepartment = (req, res, next) => {
  Department.find({})
    .populate("hod", "username")
    .then((dep) => {
      res.render("admin/manage-department", {
        departments: dep,
        username: req.session.user.username,
        pageTitle: "Manage Departments",
        path: "/admin/manage-department",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditDepartment = (req, res, next) => {
  Department.findById(req.params.depId)
    .then((dep) => {
      User.find({ role: "HOD" })
        .then((hod) => {
          res.render("admin/edit-department", {
            pageTitle: "Edit Department",
            path: "/admin/manage-department",
            hods: hod,
            dep: dep,
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

exports.postEditDepartment = (req, res, next) => {
  const hod = req.body.hod;
  const title = req.body.title;
  const depId = req.body.depId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-department", {
      username: req.session.user.username,
      pageTitle: "Edit Department",
      path: "/admin/manage-department",
      hasError: true,
      department: {
        _id: depId,
        title: title,
        hod: hod,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Department.findById(depId)
    .then((dep) => {
      dep.title = title;
      dep.hod = hod;
      return dep.save().then((result) => {
        console.log("Department Updated"),
          res.redirect("/admin/manage-department");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteDepartment = (req, res, next) => {
  const depId = req.body.depId;
  User.find({ department: depId }).then((emp) => {
    if (emp.length > 0) {
      return res.redirect("/admin/manage-department");
    } else {
      Department.findByIdAndRemove(depId)
        .then((result) => {
          console.log("Department Deleted");
          res.redirect("/admin/manage-department");
        })
        .catch((err) => console.log(err));
    }
  });
};

exports.getViewAttendance = (req, res, next) => {
  Department.find({})
    .then((dep) => {
      res.render("admin/view-attendance", {
        departments: dep,
        username: req.session.user.username,
        pageTitle: "View Attendance",
        path: "/admin/view-attendance",
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
  LeavingRequest.find({})
    .populate({
      path: "user",
      populate: {
        path: "department",
        model: "department",
      },
    })
    .then((data) => {
      console.log(data);
      res.render("admin/leaving-requests", {
        pageTitle: "Leaving Request",
        path: "/admin/leaving-request",
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
            res.redirect("/admin/leaving-request");
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
            res.redirect("/admin/leaving-request");
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

exports.adminHome = (req, res, next) => {
  User.countDocuments({ role: "Employee" })
    .then((emp) => {
      User.countDocuments({ role: "HOD" })
        .then((hod) => {
          Department.countDocuments({})
            .then((dep) => {
              res.render("admin/home", {
                department: dep,
                hod: hod,
                emp: emp,
                username: req.session.user.username,
                pageTitle: "View Attendance",
                path: "/admin/home",
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
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.employeeAttendance = (req, res, next) => {
  const empId = req.params.empId;
  Attendance.find({ user: empId })
    .populate("user", 'username')
    .then((data) => {
      res.render("admin/employee-attendance", {
        data: data,
        username: req.session.user.username,
        pageTitle: "View Employee Attendance",
        path: "/admin/manage-employee",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

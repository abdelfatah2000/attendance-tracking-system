const app = require("express").Router();
const adminControllers = require("../controllers/admin.controllers");
const isAuth = require("../config/auth");

app.get("/add-employee", isAuth, adminControllers.getAddEmployee);
app.post("/add-employee", isAuth, adminControllers.postAddEmployee);
app.get("/add-hod", isAuth, adminControllers.getAddHOD);
app.post("/add-hod", isAuth, adminControllers.postAddHOD);
app.get("/add-department", isAuth, adminControllers.getAddDepartment);
app.post("/add-department", isAuth, adminControllers.postAddDepartment);
module.exports = app;

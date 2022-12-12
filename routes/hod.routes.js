const app = require("express").Router();
const hodControllers = require("../controllers/hod.controllers");
const isAuth = require("../config/auth");

app.get("/add-employee", isAuth, hodControllers.getAddEmployee);
app.post("/add-employee", isAuth, hodControllers.postAddEmployee)
app.get("/manage-employee", isAuth, hodControllers.getManageEmployee);
app.get("/edit-employee/:employeeId", isAuth, hodControllers.getEditEmployee);
app.post("/edit-employee", isAuth, hodControllers.postEditEmployee);
app.post("/delete-employee", isAuth, hodControllers.deleteEmployee);
module.exports = app;

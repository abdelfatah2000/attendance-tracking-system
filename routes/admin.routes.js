const app = require("express").Router();
const adminControllers = require("../controllers/admin.controllers");
const isAuth = require("../config/auth");


app.get("/add-employee", isAuth, adminControllers.getAddEmployee);
app.post("/add-employee", isAuth, adminControllers.postAddEmployee);
app.get("/add-hod", isAuth, adminControllers.getAddHOD);
app.post("/add-hod", isAuth, adminControllers.postAddHOD);
app.get("/add-department", isAuth, adminControllers.getAddDepartment);
app.post("/add-department", isAuth, adminControllers.postAddDepartment);
app.get("/manage-employee", isAuth, adminControllers.getManageEmployee);
app.get("/edit-employee/:employeeId", isAuth, adminControllers.getEditEmployee);
app.post("/edit-employee", isAuth, adminControllers.postEditEmployee);
app.post("/delete-employee", isAuth, adminControllers.deleteEmployee);
app.get("/manage-hod", isAuth, adminControllers.getManageHOD);
app.get("/edit-hod/:hodId", isAuth, adminControllers.getEditHOD);
app.post("/edit-hod", isAuth, adminControllers.postEditHOD);
app.post("/delete-hod", isAuth, adminControllers.deleteHOD);
app.get("/manage-department", isAuth, adminControllers.getManageDepartment);
app.get("/edit-department/:depId", isAuth, adminControllers.getEditDepartment);
app.post("/edit-department", isAuth, adminControllers.postEditDepartment);
app.post("/delete-department", isAuth, adminControllers.deleteDepartment);
app.get("/view-attendance", isAuth, adminControllers.getViewAttendance);
app.post("/view-attendance", isAuth, adminControllers.postViewAttendance);
app.get("/leaving-request", isAuth, adminControllers.getLeavingRequest);
app.get("/approve-leaving-request/:reqId", isAuth, adminControllers.approveLeavingRequest);
app.post("/reject-leaving-request/:reqId", isAuth, adminControllers.rejectLeavingRequest);
app.get("/home", isAuth, adminControllers.adminHome);
app.get("/employee-attendance/:empId", isAuth, adminControllers.employeeAttendance);


module.exports = app;

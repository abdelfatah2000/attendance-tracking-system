const mongoose = require("mongoose");

const attendanceSchema = new mongoose(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    check_in: Date,
    check_out: Date,
    working_hour: Number,
  },
  {
    timestamps: true,
  }
);
const Attendance = mongoose.model("attendance", attendanceSchema);
module.exports = Attendance;

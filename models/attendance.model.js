const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    check_in: Date,
    check_out: Date,
    dialy_working_hour: Number,
    present: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("attendance", attendanceSchema);



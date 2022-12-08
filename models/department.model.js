const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("department", departmentSchema);
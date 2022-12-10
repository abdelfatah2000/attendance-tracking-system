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
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("department", departmentSchema);
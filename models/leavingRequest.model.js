const mongoose = require("mongoose");

const leavingRequestSchema = new mongoose.Schema(
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
    reason: String,
    status: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
  }
);
const LeavingRequest = mongoose.model("leavingRequest", leavingRequestSchema);
module.exports = LeavingRequest;

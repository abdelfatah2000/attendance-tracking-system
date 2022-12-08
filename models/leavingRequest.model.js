const mongoose = require("mongoose");

const leavingRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: Boolean,
  },
  {
    timestamps: true,
  }
);
const LeavingRequest = mongoose.model("leavingRequest", leavingRequestSchema);
module.exports = LeavingRequest;

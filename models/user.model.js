const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Employee",
      enum: ["HOD", "Employee"],
    },
    absence: {
      type: Number,
      default: 0,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.SALTROUNDS)
  );
});

module.exports = mongoose.model("user", userSchema);

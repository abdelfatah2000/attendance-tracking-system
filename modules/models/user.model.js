const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Customer",
      enum: ["HOD", "Employee"],
    },
    absence: {
      type: Number,
      default: 0,
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

const User = mongoose.model("user", userSchema);
module.exports = {
  User,
};

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: String,
    picture: String,
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
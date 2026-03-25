import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    wins: {
      type: Number,
      default: 0,
      min: 0,
    },
    sessionToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

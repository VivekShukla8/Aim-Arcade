import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleAuth;
      },
    },

    googleAuth: {
      type: Boolean,
      default: false,
    },

    googleId: { type: String },
    avatar: { type: String },
    authType: { type: String, enum: ["local", "google"], default: "local" },

    role: {
      type: String,
      enum: ["player", "owner"],
      default: "player",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

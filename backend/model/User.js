import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    full_name: { type: String, required: true, trim: true, maxlength: 120 },
    role: {
      type: String,
      enum: ["patient", "physiotherapist", "admin"],
      default: "patient",
    },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

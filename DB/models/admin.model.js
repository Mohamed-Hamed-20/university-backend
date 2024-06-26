import mongoose, { Schema, model } from "mongoose";

//user model Schema
const adminSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
      unique: true,
      min: 8,
      max: 60,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      min: 6,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    Date_of_Birth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      required: true,
    },
    imgName: {
      type: String,
      required: false,
    },
    isconfrimed: {
      type: Boolean,
      default: true,
      required: false,
    },
    Activecode: {
      type: String,
      min: 6,
      max: 500,
    },
    Agents: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

adminSchema.index({ email: 1 }, { unique: true });
adminSchema.index({ FullName: 1 });

export const adminModel =
  mongoose.models.adminModel || model("admin", adminSchema);

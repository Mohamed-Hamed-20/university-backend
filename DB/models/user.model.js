import { Schema, Types, model } from "mongoose";

// subcategory model Schema
const userSchema = new Schema(
  {
    Full_Name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      min: 9,
      max: 66,
    },
    National_Id: {
      type: String,
      required: true,
      unique: true,
      minlength: 14,
      maxlength: 14,
    },
    Student_Code: {
      type: String,
      required: true,
      unique: true,
      minlength: 14,
      maxlength: 15,
    },
    Date_of_Birth: {
      type: Date,
      required: true,
    },
    PhoneNumber: {
      type: String,
      required: true,
      min: 11,
      max: 11,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
      lowercase: true,
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
    department: {
      type: String,
      lowercase: true,
      enum: ["cs", "is", "sc", "ai"],
    },
    password: {
      type: String,
      min: 8,
      max: 24,
    },
    imgName: {
      type: String,
      required: false,
    },
    TotalGpa: {
      type: Number,
      required: false,
      default: 2,
      // min: 0,
      // max: 30,
    },
    totalCreditHours: {
      type: Number,
      required: false,
      default: 0,
      // min: 0,
      // max: 200,
    },
  },
  { timestamps: true }
);

userSchema.index({ Student_Code: 1 }, { unique: true });
userSchema.index({ National_Id: 1 }, { unique: true });
userSchema.index({ Full_Name: 1 }, { unique: true });
userSchema.index({ Full_Name: "text" });
const userModel = model("user", userSchema);

export default userModel;

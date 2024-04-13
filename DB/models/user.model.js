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
      maxlength: 14,
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
    level: {
      type: String,
      lowercase: true,
      enum: ["one", "two", "three", "four", "graduated"],
    },
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
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

export default userModel;

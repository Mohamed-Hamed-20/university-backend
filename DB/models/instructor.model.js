import mongoose, { Schema, Types, model } from "mongoose";

//user model Schema
const InstructorSchema = new Schema(
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
      enum: ["user", "instructor"],
      required: true,
      default: "instructor",
    },
    isconfrimed: {
      type: Boolean,
      default: false,
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
      enum: ["cs", "is", "sc", "ai"],
      required: true,
      lowercase: true,
    },
    imgName: {
      type: String,
      required: false,
      min: 15,
    },
    Materials: [
      {
        type: Types.ObjectId,
        ref: "course",
        default: false,
      },
    ],
    Training: [
      {
        type: Types.ObjectId,
        ref: "Training",
        default: false,
      },
    ],
  },
  { timestamps: true }
);

InstructorSchema.path("Materials").default(undefined);

InstructorSchema.path("Materials").required(false);

InstructorSchema.path("Training").default(undefined);

InstructorSchema.path("Training").required(false);

export const InstructorModel =
  mongoose.models.InstructorModel || model("Instructor", InstructorSchema);

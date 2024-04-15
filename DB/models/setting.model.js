import mongoose, { Schema, Types } from "mongoose";

const settingSchema = new Schema({
  //Student Setting
  StudentLogin: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  StudentRegister: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  StudentViewGrates: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  StudentViewAvailablecourses: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },

  //Instructor Setting
  InstructorLogin: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  InstructoruploadsGrates: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },

  // Admin setting
  AdminLogin: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  AdminEditStudent: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  AdminEditInstructor: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  AdminEditTraining: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  AdminEditSemster: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  AdminEditCourses: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  AdminEditRegister: {
    type: String,
    default: ["yes", "no"],
    lowercase: true,
    required: false,
  },
  deniedRoutes: [
    {
      type: String,
      required: true,
    },
  ],
  MainSemsterId: {
    type: Types.ObjectId,
    required: true,
    ref: "Semster",
  },
  MaxAllowTrainingToRegister: {
    type: Number,
    required: true,
    default: 2,
    min: 0,
    max: 10,
  },
  AllowTrainingRegister: {
    type: Boolean,
    default: false,
  },
  updateStudentLevel: {
    type: Boolean,
    default: true,
  },
});

const settingModel = mongoose.model("setting", settingSchema);

export default settingModel;

import mongoose, { Schema, Types } from "mongoose";

const settingSchema = new Schema({
  //Student Setting
  StudentLogin: {
    type: Boolean,
    default: false,
  },
  StudentRegister: {
    type: Boolean,
    default: false,
  },
  StudentViewGrates: {
    type: Boolean,
    default: false,
  },
  StudentViewAvailablecourses: {
    type: Boolean,
    default: false,
  },

  //Instructor Setting
  InstructorLogin: {
    type: Boolean,
    default: false,
  },
  InstructoruploadsGrates: {
    type: Boolean,
    default: false,
  },

  // Admin setting
  AdminLogin: {
    type: Boolean,
    default: false,
  },
  AdminEditStudent: {
    type: Boolean,
    default: false,
  },
  AdminEditInstructor: {
    type: Boolean,
    default: false,
  },
  AdminEditTraining: {
    type: Boolean,
    default: false,
  },
  AdminEditSemster: {
    type: Boolean,
    default: false,
  },
  AdminEditCourses: {
    type: Boolean,
    default: false,
  },
  AdminEditRegister: {
    type: Boolean,
    default: false,
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

import mongoose, { Types } from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    desc: {
      type: String,
      required: false,
      min: 20,
      max: 300,
    },
    credit_hour: {
      type: Number,
      required: true,
      enum: [2, 3],
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: false,
    },
    OpenForRegistration: {
      type: Boolean,
      default: false,
    },
    Prerequisites: [
      {
        type: Types.ObjectId,
        ref: "course",
      },
    ],
  },
  { timestamps: true }
);

CourseSchema.path("Prerequisites").default(undefined);

CourseSchema.path("Prerequisites").required(false);

const CourseModel = mongoose.model("course", CourseSchema);

export default CourseModel;

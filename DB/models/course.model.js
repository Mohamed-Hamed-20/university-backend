import mongoose, { Types } from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: true,
      lowercase: true,
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
    OpenForRegistration: {
      type: Boolean,
      default: false,
    },
    department: [
      {
        type: String,
        enum: ["cs", "is", "sc", "ai"],
      },
    ],
    Prerequisites: [
      {
        type: Types.ObjectId,
        ref: "course",
      },
    ],
    ImgUrls: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);

CourseSchema.path("Prerequisites").default(undefined);

CourseSchema.path("Prerequisites").required(false);

CourseSchema.index({ course_name: 1 });
CourseSchema.index({ email: 1 });
CourseSchema.index({ Materials: 1 });
CourseSchema.index({ Training: 1 });


const CourseModel = mongoose.model("course", CourseSchema);

export default CourseModel;

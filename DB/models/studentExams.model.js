import { Schema, model, Types } from "mongoose";
const studentExamschema = new Schema(
  {
    StudentId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    CoursesExamed: [
      {
        courseId: {
          type: Types.ObjectId,
          ref: "course",
        },
        Status: {
          type: String,
          enum: ["pass", "faild"],
        },
      },
    ],
    TotalGpa: {
      type: Number,
      required: true,
      min: 0,
      max: 4,
    },
  },
  { timestamps: true }
);
const studentExamModel = model("studentExams", studentExamschema);

export default studentExamModel;

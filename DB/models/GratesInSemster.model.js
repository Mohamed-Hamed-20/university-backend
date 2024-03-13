
import { Schema, Types, model } from "mongoose";

const GratesInSemsterSchema = new Schema({
  studentId: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
  semsterId: {
    type: Types.ObjectId,
    ref: "semster",
    required: true,
  },
  GpaInThisSemester: {
    type: Number,
    min: 0,
    max: 4,
    required: true,
  },
  HoursInSemster: {
    type: Number,
    min: 0,
    max: 18,
    required: true,
  },
  StudentCourseGrateIds: [
    {
      type: Types.ObjectId,
      ref: "Student_Course_Grate",
      required: true,
    },
  ],
});

const GratesInSemsterModel = model(
  "Student_Grates_In_Semster",
  GratesInSemsterSchema
);

export default GratesInSemsterModel;

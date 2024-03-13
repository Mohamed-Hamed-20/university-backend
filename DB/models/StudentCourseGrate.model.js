import { Schema, Types, model } from "mongoose";

const studentCourseGrateSchema = new Schema({
  studentId: { type: Types.ObjectId, ref: "user" },
  courseId: { type: Types.ObjectId, ref: "course", required: true },
  Points: { type: Number, min: 0, max: 4, required: true },
  Grade: {
    type: String,
    enum: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
    required: true,
  },
  FinalExam: { type: Number, min: 0, max: 50, required: true },
  Oral: { type: Number, min: 0, max: 10, required: true },
  Practical: { type: Number, min: 0, max: 20, required: true },
  Midterm: { type: Number, min: 0, max: 20, required: true },
  YearWorks: { type: Number, min: 0, max: 30, required: true },
  TotalGrate: { type: Number, min: 0, max: 100, required: true },
});

const StudentCourseGrateModel = model(
  "Student_Course_Grate",
  studentCourseGrateSchema
);

export default StudentCourseGrateModel;

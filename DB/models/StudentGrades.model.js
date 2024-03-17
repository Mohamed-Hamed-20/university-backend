import mongoose, { Types } from "mongoose";

const GrateSchema = new mongoose.Schema({
  studentId: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
  courseId: {
    type: Types.ObjectId,
    ref: "course",
    required: true,
  },
  Points: {
    type: Number,
    min: 0,
    max: 4,
    required: true,
  },
  Grade: {
    type: String,
    enum: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
    required: true,
  },
  FinalExam: {
    type: Number,
    min: 0,
    max: 50,
    required: true,
  },
  Oral: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  Practical: {
    type: Number,
    min: 0,
    max: 20,
    required: true,
  },
  Midterm: {
    type: Number,
    min: 0,
    max: 20,
    required: true,
  },
  YearWorks: {
    type: Number,
    min: 0,
    max: 30,
    required: true,
  },
  TotalGrate: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
});

const semsterGradeSchema = new mongoose.Schema({
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
  GpaInsemster: {
    type: Number,
    min: 0,
    max: 4,
    required: true,
  },
  HoursInsemster: {
    type: Number,
    min: 0,
    max: 18,
    required: true,
  },
  courseGrates: [
    {
      type: Types.ObjectId,
      ref: "Grate",
      required: true,
    },
  ],
});

const studentGradesSchema = new mongoose.Schema({
  studentId: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
  TotalGpa: {
    type: Number,
    required: true,
    min: 0,
    max: 4,
    default: 2,
  },
  totalCreditHours: {
    type: Number,
    required: true,
  },
  semsterGratesIds: [
    {
      type: Types.ObjectId,
      ref: "semsterGrade",
      required: true,
    },
  ],
});

export const GradeModel = mongoose.model("Grate", GrateSchema);
export const SemesterGradeModel = mongoose.model(
  "semsterGrade",
  semsterGradeSchema
);
export const StudentGradeModel = mongoose.model(
  "StudentGrades",
  studentGradesSchema
);

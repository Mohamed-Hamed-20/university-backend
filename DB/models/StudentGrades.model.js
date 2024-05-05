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
  creditHours: {
    type: Number,
    required: false,
    enum: [2, 3],
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
    max: 50,
    required: true,
  },
  TotalGrate: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  semsterId: {
    type: Types.ObjectId,
    ref: "Semster",
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
    ref: "Semster",
    required: true,
  },
  HoursInSemster: {
    type: Number,
    required: false, //Edit this later  [خليها true]
    min: 0,
    max: 30,
  },
  GpaInSemster: {
    type: Number,
    required: false, //Edit this later  [خليها true]
    min: 0,
    max: 4,
  },
  courseGrates: [
    {
      type: Types.ObjectId,
      ref: "Grate",
      required: true,
    },
  ],
});

GrateSchema.index({ studentId: 1 });
GrateSchema.index({ courseId: 1 });
GrateSchema.index({ semsterId: 1 });

semsterGradeSchema.index({ studentId: 1 });
semsterGradeSchema.index({ semsterId: 1 });
semsterGradeSchema.index({ courseGrates: 1 });

GrateSchema.post("deleteMany", async function (docs, next) {
  try {
    const gradesIds = docs.map((doc) => {
      return doc._id;
    });

    await SemesterGradeModel.updateMany(
      { courseGrates: { $in: gradesIds } },
      { $pull: { courseGrates: { $in: gradesIds } } }
    );

    next();
  } catch (error) {
    next(error);
  }
});

export const GradeModel = mongoose.model("Grate", GrateSchema);
export const SemesterGradeModel = mongoose.model(
  "semsterGrade",
  semsterGradeSchema
);

import mongoose, { Types } from "mongoose";
import { GradeModel, SemesterGradeModel } from "./StudentGrades.model.js";
import RegisterModel from "./Register.model.js";
import availableCoursesModel from "./availableCourses.model.js";
import { InstructorModel } from "./instructor.model.js";

const CourseSchema = new mongoose.Schema(
  {
    course_name: {
      type: String,
      required: true,
      lowercase: true,
      min: 3,
      max: 100,
    },
    desc: {
      type: String,
      required: false,
      min: 20,
      max: 8000,
    },
    credit_hour: {
      type: Number,
      required: true,
      enum: [2, 3],
    },
    OpenForRegistration: {
      type: Boolean,
      default: false,
      required: false,
    },
    department: [
      {
        type: String,
        enum: ["cs", "is", "sc", "ai"],
        required: false,
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

CourseSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    const deletedCourse = doc;

    if (!deletedCourse) {
      return next();
    }
    const GradesTodelete = await GradeModel.find({ courseId: doc._id });
    const GradesIds = GradesTodelete.map((doc) => doc._id);

    const bulkOperations = [];

    bulkOperations.push(GradeModel.deleteMany({ _id: { $in: GradesIds } }));

    bulkOperations.push(
      SemesterGradeModel.updateMany(
        { courseGrates: { $in: GradesIds } },
        { $pull: { courseGrates: { $in: GradesIds } } }
      )
    );

    bulkOperations.push(
      RegisterModel.updateMany(
        { coursesRegisterd: doc._id },
        {
          $pull: { coursesRegisterd: doc._id },
          $inc: { Available_Hours: doc.credit_hour },
        }
      )
    );

    bulkOperations.push(
      availableCoursesModel.updateMany(
        {},
        { $pull: { Available_Courses: doc._id } }
      )
    );

    bulkOperations.push(
      InstructorModel.updateMany({}, { $pull: { Materials: doc._id } })
    );

    const info = await Promise.all(bulkOperations);
    return next();
  } catch (error) {
    next(error);
  }
});

CourseSchema.index({ course_name: 1 });
CourseSchema.index({ email: 1 });
CourseSchema.index({ Materials: 1 });
CourseSchema.index({ Training: 1 });

const CourseModel = mongoose.model("course", CourseSchema);

export default CourseModel;

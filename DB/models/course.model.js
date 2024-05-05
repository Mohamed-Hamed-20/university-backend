import mongoose, { Types } from "mongoose";
import { GradeModel } from "./StudentGrades.model.js";
import RegisterModel from "./Register.model.js";
import availableCoursesModel from "./availableCourses.model.js";

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

// CourseSchema.pre("deleteOne", async function (next) {
//   try {
//     const filter = this.getQuery();

//     if (!filter._id) {
//       throw new Error("Missing _id in filter");
//     }

//     // حذف الكورس من المواد المسجلة للطلاب
//     await RegisterModel.updateMany(
//       { coursesRegisterd: filter._id },
//       { $pull: { coursesRegisterd: filter._id } }
//     );

//     // حذف الكورس من قائمة المواد المتاحة للطلاب
//     const course = await CourseModel.findById(filter._id);
//     const removedHours = course.credit_hour;
//     await availableCoursesModel.updateMany(
//       { Available_Courses: filter._id },
//       { $pull: { Available_Courses: filter._id } }
//     );

//     // زيادة عدد الساعات المتاحة
//     await RegisterModel.updateMany(
//       {},
//       { $inc: { Available_Hours: removedHours } }
//     );

//     // حذف الدرجات المرتبطة بالكورس
//     await GradeModel.deleteMany({ courseId: filter._id });

//     // حذف الكورس من قائمة المواد للمدرسين
//     await InstructorModel.updateMany(
//       { Materials: filter._id },
//       { $pull: { Materials: filter._id } }
//     );

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

CourseSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    const deletedCourse = doc;

    console.log("Deleted Course:", deletedCourse);

    const bulkOperations = [];

    bulkOperations.push({
      deleteMany: {
        filter: { courseId: deletedCourse._id },
        model: "GrateModel",
      },
    });

    bulkOperations.push({
      updateMany: {
        filter: { coursesRegisterd: deletedCourse._id },
        update: { $pull: { coursesRegisterd: deletedCourse._id } },
        model: "RegisterModel",
      },
    });

    bulkOperations.push({
      updateMany: {
        filter: { coursesRegisterd: deletedCourse._id },
        update: { $inc: { Available_Hours: +deletedCourse.credit_hour } },
        model: "RegisterModel",
      },
    });

    bulkOperations.push({
      updateMany: {
        filter: { Available_Courses: deletedCourse._id },
        update: { $pull: { Available_Courses: deletedCourse._id } },
        model: "availableCoursesModel",
      },
    });

    bulkOperations.push({
      updateMany: {
        filter: { Materials: deletedCourse._id },
        update: { $pull: { Materials: deletedCourse._id } },
        model: "InstructorModel",
      },
    });

    await Promise.all(
      bulkOperations.map((op) => mongoose.model(op.model).bulkWrite([op]))
    );

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

import availableCoursesModel from "./DB/models/availableCourses.model.js";
import CourseModel from "./DB/models/course.model.js";
import { GradeModel } from "./DB/models/StudentGrades.model.js";

import mongoose from "mongoose";

// تعيين الخيار strict إلى false لتجنب التحذير
mongoose.set("strict", false);

// دالة للاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    // الاتصال بقاعدة البيانات باستخدام رابط المُحيط
    await mongoose.connect(
      "mongodb+srv://mohamed:MH674281moh@cluster0.4h5fpsc.mongodb.net/university",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("DB connected");
  } catch (error) {
    console.error("Error in connection:", error); // طباعة الخطأ للتحقق من سبب المشكلة
  }
};
connectDB();

// Controller to get available courses for registration
export const availableCourses = async (req, res, next) => {
  // Step 1: Get the user ID
  const userId = req.user._id;

  // Step 2: Get all passed course IDs for the user
  const passedCourses = await GradeModel.distinct("courseId", {
    studentId: userId,
    TotalGrate: { $gte: 50 },
  });

  // Step 3: Get valid courses for registration
  const validCourses = await CourseModel.aggregate([
    // Match courses that the user has not passed yet and are open for registration
    {
      $match: {
        _id: { $nin: passedCourses },
        OpenForRegistration: true,
        $or: [
          { department: { $exists: false } }, // Course does not have a department
          { department: req.user.department }, // Course department matches the user's department
          { department: null, "req.user.department": null }, // No department for the course and the user
          { department: { "req.user.department": null } },
        ],
      },
    },
    // Lookup prerequisites and filter out courses that don't meet prerequisites
    {
      $lookup: {
        from: "courses",
        localField: "Prerequisites",
        foreignField: "_id",
        as: "prerequisites",
      },
    },
    {
      $match: {
        $expr: {
          $or: [
            { $eq: [{ $size: "$prerequisites" }, 0] }, // No prerequisites for the course
            { $setIsSubset: ["$prerequisites._id", passedCourses] }, // All prerequisites are passed by the user
          ],
        },
      },
    },
  ]);

  // Update or create available courses record
  const availableCoursesRecord = await availableCoursesModel.findOneAndUpdate(
    { studentId: userId },
    { Available_Courses: validCourses.map((course) => course._id) },
    { new: true, upsert: true }
  );

  if (!availableCoursesRecord) {
    return next(
      new Error("Failed to update available courses record", { cause: 500 })
    );
  }

  return res.json({ user: req.user, validCourses });
};

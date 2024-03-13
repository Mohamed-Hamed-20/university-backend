import AvailableCoursesModel from "../../../DB/models/availableCourses.model.js";
import StudentExamModel from "../../../DB/models/studentExams.model.js";
import {
  getAllValidCourses,
  createStudentExams,
} from "../../utils/createstudentExam.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const availableCourses = asyncHandler(async (req, res, next) => {
  // Get the user ID
  const userId = req.user._id;

  // Find student exams
  let studentExams = await StudentExamModel.findOne({ StudentId: userId });
  if (!studentExams) {
    studentExams = await createStudentExams(userId);
  }

  // Filter only passed courses
  const passedCourses = [];
  studentExams?.CoursesExamed.forEach((course) => {
    if (course?.Status === "pass") {
      passedCourses.push(course.courseId);
    }
  });

  // Get all valid courses and IDs
  const { validCourses, validCoursesIds } = await getAllValidCourses(
    passedCourses,
    userId
  );

  // Check if available courses exist
  let availableCoursesRecord = await AvailableCoursesModel.findOne({
    StudentId: userId,
  });

  if (availableCoursesRecord) {
    // Update available courses
    availableCoursesRecord.Available_Courses = validCoursesIds;
    await availableCoursesRecord.save();
  } else {
    // Create new available courses record
    availableCoursesRecord = await AvailableCoursesModel.create({
      StudentId: userId,
      Available_Courses: validCoursesIds,
      TotalGpa: studentExams.TotalGpa,
    });
    if (!availableCoursesRecord) {
      return next(
        new Error("Failed to create available courses record", { cause: 500 })
      );
    }
  }

  return res.json({ user: req.user._id, validCourses });
});

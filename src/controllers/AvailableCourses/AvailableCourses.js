import { GradeModel } from "../../../DB/models/StudentGrades.model.js";
import AvailableCoursesModel from "../../../DB/models/availableCourses.model.js";
import { GetMultipleImages, GetsingleImg } from "../../utils/aws.s3.js";
import { getAllValidCourses } from "../../utils/createstudentExam.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const availableCourses = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Get passed courses
  const passedCourses = await GradeModel.find({
    studentId: userId,
    TotalGrate: { $gte: 50 },
  }).distinct("courseId");

  // Get valid courses
  const { validCoursesIds, validCourses } = await getAllValidCourses({
    passedCourses,
    userId,
    studepartment: req.user.department || null,
  });

  // Update or create available courses record
  let availableCoursesRecord = await AvailableCoursesModel.findOneAndUpdate(
    { studentId: userId },
    { Available_Courses: validCoursesIds },
    { new: true, upsert: true }
  );


  // Fetch images for valid courses asynchronously
  for (const course of validCourses) {
    const images = await GetMultipleImages(course.ImgUrls);
    delete course.ImgUrls;
    course.images = images;
  }

  // Return response
  return res.status(200).json({ user: req.user._id, validCourses });
});

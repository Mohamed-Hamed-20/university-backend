import { GradeModel } from "../../../DB/models/StudentGrades.model.js";
import AvailableCoursesModel from "../../../DB/models/availableCourses.model.js";
import { GetsingleImg } from "../../utils/aws.s3.js";
import { getAllValidCourses } from "../../utils/createstudentExam.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const availableCourses = asyncHandler(async (req, res, next) => {
  // Get the user ID
  const userId = req.user._id;

  let passedCourses = [];

  //Get all courses Ids passed In
  const courses = await GradeModel.find({
    studentId: userId,
    TotalGrate: { $gte: 50 },
  })
    .select("courseId")
    .lean();

  passedCourses = courses.map((course) => course.courseId);

  // Get all valid courses and IDs
  const { validCourses, validCoursesIds } = await getAllValidCourses({
    passedCourses,
    userId,
    studepartment: req.user.department || null,
  });
  // Check if available courses exist
  let availableCoursesRecord = await AvailableCoursesModel.findOne({
    studentId: userId,
  });

  if (availableCoursesRecord) {
    // Update available courses
    availableCoursesRecord.Available_Courses = validCoursesIds;
    await availableCoursesRecord.save();
  } else {
    // Create new available courses record
    availableCoursesRecord = await AvailableCoursesModel.create({
      studentId: userId,
      Available_Courses: validCoursesIds,
    });
    if (!availableCoursesRecord) {
      return next(
        new Error("Failed to create available courses record", { cause: 500 })
      );
    }
  }

  const promises = [];
  validCourses.forEach((course) => {
    if (course.ImgUrls && course.ImgUrls.length > 0) {
      course.images = [];
      course.ImgUrls.forEach((imgName) => {
        promises.push(
          GetsingleImg({ ImgName: imgName }).then(({ url }) => {
            course.images.push({ imgName, url });
          })
        );
      });
    }
  });

  await Promise.all(promises);

  return res.status(200).json({ user: req.user._id, validCourses });
});

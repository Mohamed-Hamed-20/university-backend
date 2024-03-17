import RegisterModel from "../../../DB/models/Register.model.js";
import { GradeModel } from "../../../DB/models/StudentGrades.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { arrayofstring } from "../../utils/arrayobjectIds.js";
import { calculateGradeAndPoints } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const uploadgrate = asyncHandler(async (req, res, next) => {
  const { courseId, studentId, FinalExam, Oral, Practical, Midterm } = req.body;
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Invalid CourseId", { status: 400 }));
  }

  // Check if the user is an instructor for this course
  const Materials = await arrayofstring(req.user.Materials);
  if (!Materials.includes(courseId.toString())) {
    return next(
      new Error("You are not allowed to upload grades for this course", {
        status: 403,
      })
    );
  }

  // Find the registration document for this user
  const register = await RegisterModel.findOne({ studentId: studentId });

  // If registration document is not found
  if (!register) {
    return next(
      new Error("Registration document for user not found", { status: 400 })
    );
  }

  // If user is not registered for this course
  if (!register.coursesRegisterd.includes(courseId)) {
    return next(
      new Error(
        "User is not registered for this course or course grade is already uploaded",
        { status: 400 }
      )
    );
  }

  // Calculate TotalGrate & YearWorks
  const YearWorks = Oral + Practical;
  const TotalGrate = FinalExam + Midterm + YearWorks;

  // Calculate grade and points
  const { grade, points } = calculateGradeAndPoints(
    TotalGrate,
    course.credit_hour
  );
  if (!grade) {
    return next(new Error("Server Error", { status: 500 }));
  }

  // Create Student Course Grade
  const GradeInSingleCourse = {
    studentId,
    courseId,
    Points: points,
    Grade: grade,
    FinalExam,
    Oral,
    Practical,
    Midterm,
    YearWorks,
    TotalGrate,
  };
  const grate = await GradeModel.create(GradeInSingleCourse);
  if (!grate) {
    return next(new Error("server Error Try again later", { cause: 400 }));
  }
  req.course = course;
  req.register = register;
  req.Grade = grate;

  // console.log({ grate, course, register });
  return next();
});

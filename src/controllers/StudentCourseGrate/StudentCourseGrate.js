import RegisterModel from "../../../DB/models/Register.model.js";
import StudentCourseGrateModel from "../../../DB/models/StudentCourseGrate.model.js";
import { arrayofstring, filterArray } from "../../utils/arrayobjectIds.js";
import { calculateGradeAndPoints } from "../../utils/calcgrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addcoursegrate = asyncHandler(async (req, res, next) => {
  const { courseId, studentId, FinalExam, Oral, Practical, Midterm } = req.body;
  console.log(req.user.Materials);
  console.log(courseId);
  //check if he instructor to this course
  const Materials = await arrayofstring(req.user.Materials);
  if (!Materials.includes(courseId.toString())) {
    return next(new Error("you Not allow to upload Grates to this course"));
  }

  //find this user and register doc
  const register = await RegisterModel.findOne({ StudentId: studentId });

  //if not found
  if (!register) {
    return next(
      new Error("register document for user not founds", { cause: 400 })
    );
  }

  //user doesnt register this course
  if (!register.coursesRegisterd.includes(courseId)) {
    return next(
      new Error(
        "User donsen't register this course or course grate is already uploaded",
        { cause: 400 }
      )
    );
  }
  //calc TotalGrate & YearWorks
  const YearWorks = Oral + Practical;
  const TotalGrate = FinalExam + Midterm + YearWorks;

  //calc  grade, points
  const { grade, points } = calculateGradeAndPoints(TotalGrate);
  console.log(grade, points);
  if (!grade || points) {
    return next(new Error("server Error", { cause: 500 }));
  }

  // create Student Course Grate
  const StudentCourseGrate = {
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
  const result = await StudentCourseGrateModel.create(StudentCourseGrate);
  if (!result) {
    return next(new Error("server Error try again later:(", { cause: 500 }));
  }

  //filter coursesRegisterd and store new result
  const coursesRegisterd = filterArray(register.coursesRegisterd, courseId);
  register.coursesRegisterd = coursesRegisterd;
  await register.save();



  


  return res.json({ messgae: "Done grate added successfully", result: result });
});
export const updatecoursegrate = asyncHandler(async (req, res, next) => {});
export const deletecoursegrate = asyncHandler(async (req, res, next) => {});
export const Getcoursegrate = asyncHandler(async (req, res, next) => {});
// export const addcoursegrate = asyncHandler(async (req, res, next) => {});
// export const addcoursegrate = asyncHandler(async (req, res, next) => {});

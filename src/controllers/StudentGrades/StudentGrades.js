import RegisterModel from "../../../DB/models/Register.model.js";
import { StudentGradeModel } from "../../../DB/models/StudentGrades.model.js";
import { filterArray } from "../../utils/arrayobjectIds.js";
import { calculateCumulativeGPA, updateGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addgrate = asyncHandler(async (req, res, next) => {
  const { studentId, courseId } = req.body;
  const register = req.register;
  const semsterGrate = req.semsterGrate;
  const grade = req.grade;

  // Find or create student's overall grades document
  let userGrades = await StudentGradeModel.findOne({ studentId: studentId });

  let result;

  if (!userGrades) {
    const newUserGrades = {
      studentId: studentId,
      semsterGratesIds: [req.semsterGrate._id],
    };
    result = await StudentGradeModel.create(newUserGrades);
  }

  if (userGrades) {
    if (!userGrades.semsterGratesIds.includes(req.semsterGrate._id)) {
      userGrades.semsterGratesIds.push(req.semsterGrate._id);
    }
    result = await userGrades.save();
  }

  if (!result) {
    return next(new Error("Server Error", { status: 500 }));
  }

  // filter coursesRegisterd and store new result
  const coursesRegisterd = filterArray(register.coursesRegisterd, courseId);

  register.coursesRegisterd = coursesRegisterd;
  await register.save();

  return res.status(200).json({
    message: "Result uploaded successfully",
    grade,
    semsterGrate,
  });
});

export const updateGrate = asyncHandler(async (req, res, next) => {
  const { studentId } = req.body;

  const studentGrade = await StudentGradeModel.findOne({ studentId });
  if (!studentGrade) {
    return next(new Error("studentGrade not found", { cause: 500 }));
  }

  studentGrade.TotalGpa = cumulativeGPA;
  studentGrade.totalCreditHours = totalCreditHours;
});

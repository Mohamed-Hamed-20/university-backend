import RegisterModel from "../../../DB/models/Register.model.js";
import { StudentGradeModel } from "../../../DB/models/StudentGrades.model.js";
import semsterModel from "../../../DB/models/semster.model.js";
import userModel from "../../../DB/models/user.model.js";
import { filterArray } from "../../utils/arrayobjectIds.js";
import { calculateCumulativeGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { updateSemster } from "../../utils/updatesemster.js";

export const addgrate = asyncHandler(async (req, res, next) => {
  const { courseId, studentId } = req.body;
  const course = req.course;
  const register = req.register;
  const Grade = req.Grade;
  const { Points } = req.Grade;
  const semsterGrate = req.semsterGrate;

  // Find or create student's overall grades document
  let userGrades = await StudentGradeModel.findOne({ studentId: studentId });

  // Calculate GPA for the semster
  const { cumulativeGPA, totalCreditHours } = calculateCumulativeGPA({
    points: Points,
    creditHours: course.credit_hour,
    oldGPA: userGrades?.TotalGpa || 0,
    oldCreditHours: userGrades?.totalCreditHours || 0,
  });

  let result;

  if (!userGrades) {
    const newUserGrades = {
      studentId: studentId,
      TotalGpa: cumulativeGPA,
      totalCreditHours: totalCreditHours,
      semsterGratesIds: [req.semsterGrate._id],
    };
    result = await StudentGradeModel.create(newUserGrades);
  }

  if (userGrades) {
    userGrades.TotalGpa = cumulativeGPA;
    userGrades.totalCreditHours = totalCreditHours;
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
  if (coursesRegisterd.length == 0) {
    const oldsemster = await semsterModel.findById(register.semsterId);
    register.Available_Hours = 0;
    //update user semster
    // console.log(oldsemster, userGrades.totalCreditHours);
    const newsemster = await updateSemster({
      totalHoursPass: userGrades.totalCreditHours,
      oldsemster: oldsemster,
    });
    // console.log(newsemster);
    register.semsterId = newsemster._id;
    const updatestudent = await userModel.findByIdAndUpdate(
      studentId,
      { semsterId: newsemster },
      { new: true }
    );
  }
  register.coursesRegisterd = coursesRegisterd;
  // await register.save();

  return res.status(200).json({
    message: "Result uploaded successfully",
    Grade,
    semsterGrate,
  });
});

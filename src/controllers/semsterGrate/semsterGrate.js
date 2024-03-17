import { SemesterGradeModel } from "../../../DB/models/StudentGrades.model.js";
import { calculateCumulativeGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addTosemster = asyncHandler(async (req, res, next) => {
  const { studentId } = req.body;
  const course = req.course;
  const { semsterId } = req.register;
  const { Points } = req.Grade;

  const semster = await SemesterGradeModel.findOne({ studentId, semsterId });

  // Calculate GPA for the semster
  const { cumulativeGPA, totalCreditHours } = calculateCumulativeGPA({
    points: Points,
    creditHours: course.credit_hour,
    oldGPA: semster?.GpaInsemster || 0,
    oldCreditHours: semster?.HoursInsemster || 0,
  });

  let result;
  if (!semster) {
    const semsterGrate = {
      studentId,
      semsterId,
      GpaInsemster: cumulativeGPA,
      HoursInsemster: totalCreditHours,
      courseGrates: [req.Grade._id],
    };
    result = await SemesterGradeModel.create(semsterGrate);
  }

  if (semster) {
    semster.GpaInsemster = cumulativeGPA;
    semster.HoursInsemster = totalCreditHours;
    semster.courseGrates.push(req.Grade._id);
    result = await semster.save();
  }
  req.semsterGrate = result;
  return next();
});

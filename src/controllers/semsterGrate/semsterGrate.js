import RegisterModel from "../../../DB/models/Register.model.js";
import { SemesterGradeModel } from "../../../DB/models/StudentGrades.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import userModel from "../../../DB/models/user.model.js";
import { filterArray } from "../../utils/arrayobjectIds.js";
import { calculateCumulativeGPA, updateGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addTosemster = asyncHandler(async (req, res, next) => {
  const { studentId, courseId } = req.body;
  const register = req.register;
  const grade = req.Grade;
  const semsterId = req.semsterId;
  const course = req.course;
  const student = req.student;

  // find SemsterGrade Document
  const semsterGrades = await SemesterGradeModel.findOne({
    studentId,
    semsterId,
  });

  //calc GPA for semster
  const { cumulativeGPA, totalCreditHours } = calculateCumulativeGPA({
    points: grade.Points,
    creditHours: course.credit_hour,
    oldGPA: semsterGrades?.GpaInSemster || 2,
    oldCreditHours: semsterGrades?.HoursInSemster || 0,
  });

  let result;
  if (!semsterGrades) {
    const newsemsterGrate = {
      studentId,
      semsterId,
      GpaInSemster: cumulativeGPA,
      HoursInSemster: totalCreditHours,
      courseGrates: [req.Grade._id],
    };
    result = await SemesterGradeModel.create(newsemsterGrate);
  }

  // if he already have update semster Grades
  if (semsterGrades) {
    semsterGrades.courseGrates.push(req.Grade._id);
    semsterGrades.GpaInSemster = cumulativeGPA;
    semsterGrades.HoursInSemster = totalCreditHours;
    result = await semsterGrades.save();
  }

  //student Update Gpa and hours passed
  const { cumulativeGPA: TotalGpa, totalCreditHours: TotalHours } =
    calculateCumulativeGPA({
      points: grade.Points,
      creditHours: course.credit_hour,
      oldGPA: student?.TotalGpa || 2,
      oldCreditHours: student?.totalCreditHours || 0,
    });

  // update Gpa for student
  student.TotalGpa = TotalGpa;
  student.totalCreditHours = TotalHours;

  //update and  filter coursesRegisterd and store new result
  const coursesRegisterd = filterArray(register.coursesRegisterd, courseId);
  register.coursesRegisterd = coursesRegisterd;

  const updatePromises = [student.save(), register.save()];
  const [newstudent, newRegister] = await Promise.all(updatePromises);

  if (!newstudent) {
    return next(new Error("SERVER ERROR :(", { cause: 500 }));
  }

  return res.status(200).json({
    message: "Result uploaded successfully",
    grade: grade,
    semsterGrades: result,
    student: newstudent,
    register: newRegister,
  });
});

export const updateSemsterGrate = asyncHandler(async (req, res, next) => {
  const oldGrade = req.oldGrade;
  const grade = req.grade;

  // Find the SemesterGrade document based on studentId and _id
  const semsterGrade = await SemesterGradeModel.findOne({
    studentId: req.grade.studentId,
    courseGrates: grade._id,
  });

  // Check if semster exists
  if (!semsterGrade) {
    return next(
      new Error("Student doesn't have courseGrateId already", { cause: 400 })
    );
  }
  const updatePromises = [];
  // =====================================Update Gpa in semster ============================================
  //delete Gpa to new one
  const { newGPA, newCreditHours } = updateGPA({
    courseGPA: oldGrade.oldPoints,
    courseCreditHours: oldGrade.oldCreditHours,
    currentGPA: semsterGrade.GpaInSemster,
    totalCreditHours: semsterGrade.HoursInSemster,
  });

  // add mew result to gpa
  const { cumulativeGPA, totalCreditHours } = calculateCumulativeGPA({
    points: grade.Points,
    creditHours: grade.courseId.credit_hour,
    oldGPA: newGPA,
    oldCreditHours: newCreditHours,
  });

  semsterGrade.GpaInSemster = cumulativeGPA;
  semsterGrade.HoursInSemster = totalCreditHours;
  // push to update
  updatePromises.push(semsterGrade.save());

  // ===========================================Update student total gpa====================================
  const student = oldGrade.studentId;

  //delete Gpa to new one حذف القديم
  const { newGPA: newTotalGpa, newCreditHours: newTotalHours } = updateGPA({
    courseGPA: oldGrade.oldPoints,
    courseCreditHours: oldGrade.oldCreditHours,
    currentGPA: student.TotalGpa,
    totalCreditHours: student.totalCreditHours,
  });

  // add mew result to gpa
  const { cumulativeGPA: TotalGpa, totalCreditHours: TotalHours } =
    calculateCumulativeGPA({
      points: grade.Points,
      creditHours: grade.courseId.credit_hour,
      oldGPA: newTotalGpa,
      oldCreditHours: newTotalHours,
    });

  updatePromises.push(
    userModel.findByIdAndUpdate(
      { _id: student._id },
      { TotalGpa: TotalGpa, totalCreditHours: TotalHours },
      { new: true }
    )
  );

  const [semsterResult, stuNewInfo] = await Promise.all(updatePromises);
  // Response
  return res.status(200).json({
    message: "Grate updated successfully",
    semsterResult,
    stuNewInfo,
    grate: req.grade,
  });
});

export const deleteSemsterGrate = asyncHandler(async (req, res, next) => {
  const grade = req.grade;
  const student = req.grade.studentId;
  const course = req.grade.courseId;
  const { backToRegister } = req.body;

  const semsterGrate = await SemesterGradeModel.findOne({
    studentId: grade.studentId,
    courseGrates: grade._id,
  });

  if (!semsterGrate) {
    return next(new Error("semster course grate not found", { cause: 404 }));
  }

  const updatePromises = [];
  // if he want this grade to back in register
  if (backToRegister == "yes") {
    // find register model add this result
    const register = await RegisterModel.findOne({
      studentId: req.grade.studentId,
    });
    if (!register) {
      return next(new Error("register document not found for this user"));
    }
    register.coursesRegisterd.push(grade.courseId);
    updatePromises.push(register.save());
  } else {
    updatePromises.push({});
  }

  //================================= update Gpa and total hours==================================

  const { newGPA, newCreditHours } = updateGPA({
    courseGPA: grade.Points,
    courseCreditHours: course.credit_hour,
    currentGPA: semsterGrate.GpaInSemster || 0,
    totalCreditHours: semsterGrate.HoursInSemster || course.credit_hour,
  });

  //update
  semsterGrate.GpaInSemster = newGPA;
  semsterGrate.HoursInSemster = newCreditHours;

  //delete id from semsterGrate
  const newCourseGrates = await filterArray(
    semsterGrate.courseGrates,
    grade._id
  );
  //update
  semsterGrate.courseGrates = newCourseGrates;

  // ==================================================update student Info=====================================
  const { newGPA: TotalGpa, newCreditHours: TotalHours } = updateGPA({
    courseGPA: grade.Points,
    courseCreditHours: course.credit_hour,
    currentGPA: student.TotalGpa || 0,
    totalCreditHours: student.totalCreditHours || course.credit_hour,
  });

  student.TotalGpa = TotalGpa;
  student.totalCreditHours = TotalHours;

  updatePromises.push(
    userModel
      .findByIdAndUpdate(
        { _id: student._id },
        {
          TotalGpa: TotalGpa,
          totalCreditHours: TotalHours,
        },
        { new: true }
      )
      .lean()
      .select("_id TotalGpa totalCreditHours Full_Name")
  );

  // delete grate
  updatePromises.push(grade.deleteOne());

  let result;
  if (newCourseGrates.length <= 0) {
    updatePromises.push(semsterGrate.deleteOne());
  } else {
    semsterGrate.courseGrates = newCourseGrates;
    updatePromises.push(semsterGrate.save());
  }
  const [newRegister, newStudent, deletedGrade, UpdatedsemsterGrade] =
    await Promise.all(updatePromises);

  return res.status(200).json({
    message: "Grate delete successfully",
    grade: deletedGrade,
    semsterInfo: result,
    newRegister,
    newStudent,
    UpdatedsemsterGrade,
  });
});

// export const grades;
export const gradesemsterforSingleuser = asyncHandler(
  async (req, res, next) => {}
);

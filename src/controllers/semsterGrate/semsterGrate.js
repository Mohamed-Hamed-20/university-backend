import RegisterModel from "../../../DB/models/Register.model.js";
import { SemesterGradeModel } from "../../../DB/models/StudentGrades.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { filterArray } from "../../utils/arrayobjectIds.js";
import { calculateCumulativeGPA, updateGPA } from "../../utils/calcGrates.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addTosemster = asyncHandler(async (req, res, next) => {
  const { studentId, courseId } = req.body;
  const semsterId = req.semsterId;
  const register = req.register;
  const grade = req.Grade;

  // find SemsterGrade Document
  const semster = await SemesterGradeModel.findOne({
    studentId,
    semsterId,
  }).populate({
    path: "semsterId",
    select: "year term startDate endDate",
  });

  let result;
  if (!semster) {
    const semsterGrate = {
      studentId,
      semsterId,
      courseGrates: [req.Grade._id],
    };
    result = await SemesterGradeModel.create(semsterGrate);
    await result.populate({
      path: "semsterId",
      select: "year term startDate endDate",
    });
  }

  if (semster) {
    console.log(req.Grade._id);
    semster.courseGrates.push(req.Grade._id);
    result = await semster.save();
  }
  // req.semsterGrate = result;

  // filter coursesRegisterd and store new result
  const coursesRegisterd = filterArray(register.coursesRegisterd, courseId);

  register.coursesRegisterd = coursesRegisterd;
  await register.save();

  return res.status(200).json({
    message: "Result uploaded successfully",
    grade: grade,
    semsterGrate: result.semsterId,
  });
});

export const updateSemsterGrate = asyncHandler(async (req, res, next) => {
  const { semsterId } = req.body;
  const { _id } = req.grade;

  // Find the SemesterGrade document based on studentId and _id
  const semster = await SemesterGradeModel.findOne({
    studentId: req.grade.studentId,
    courseGrates: _id,
  }).populate({
    path: "semsterId",
    select: "name year term",
  });

  // Check if semster exists
  if (!semster) {
    return next(
      new Error("Student doesn't have courseGrateId already", { cause: 400 })
    );
  }

  let result;
  // Check if semsterId is provided and is different from the current semsterId
  if (semsterId && semsterId.toString() !== semster.semsterId._id.toString()) {
    // Delete courseGrate from the old semster
    const newCourseGrates = filterArray(semster.courseGrates, _id);
    semster.courseGrates = newCourseGrates;

    // Create or update new semeterGrate for the new semster
    let newSemsterGrate = await SemesterGradeModel.findOne({
      studentId: req.grade.studentId,
      semsterId,
    });

    if (!newSemsterGrate) {
      newSemsterGrate = await SemesterGradeModel.create({
        studentId: req.grade.studentId,
        semsterId,
        courseGrates: [_id],
      });
    } else {
      newSemsterGrate.courseGrates.push(_id);
    }

    // Save and populate the result
    result = await newSemsterGrate.save();
    await result.populate({
      path: "semsterId",
      select: "name year term",
    });
  }

  // Check if courseGrates array is empty and delete the semster if true
  let updatedsemster;
  if (semster.courseGrates.length === 0) {
    await semster.deleteOne();
  } else {
    // Update semster with the current version
    semster.semsterId = semsterId;
    updatedsemster = await semster.save();
    await updatedsemster.populate({
      path: "semsterId",
      select: "name year term",
    });
  }

  // Response
  return res.status(200).json({
    message: "Grate updated successfully",
    semsterId: result?.semsterId || updatedsemster.semsterId,
    grate: req.grade,
  });
});

export const deleteSemsterGrate = asyncHandler(async (req, res, next) => {
  const grade = req.grade;
  const { backToRegister } = req.body;

  const semsterGrate = await SemesterGradeModel.findOne({
    studentId: grade.studentId,
    courseGrates: grade._id,
  });

  if (!semsterGrate) {
    return next(new Error("semster course grate not found", { cause: 404 }));
  }
  //delete id from semsterGrate
  const newCourseGrates = await filterArray(
    semsterGrate.courseGrates,
    grade._id
  );
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
    const added = await register.save();
    if (!added)
      return next(
        new Error("eServer error not added successfully", { cause: 500 })
      );
  }

  // delete grate
  const deletedGrade = await grade.deleteOne();

  let result;
  if (newCourseGrates.length <= 0) {
    result = await semsterGrate.deleteOne();
  } else {
    semsterGrate.courseGrates = newCourseGrates;
    result = await semsterGrate.save();
  }

  return res.status(200).json({
    message: "courseGrate delete successfully",
    grade: deletedGrade,
    semsterInfo: result,
  });
});

// export const grades;
export const gradesemsterforSingleuser = asyncHandler(
  async (req, res, next) => {}
);

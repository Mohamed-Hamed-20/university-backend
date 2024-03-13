import studentExamModel from "../../../DB/models/studentExams.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addstudentExams = asyncHandler(async (req, res, next) => {
  const { StudentId, CoursesExamed, TotalGpa } = req.body;

  const studentExams = await studentExamModel.create({
    StudentId,
    CoursesExamed,
    TotalGpa,
  });
  const populatedExams = await studentExamModel
    .findById(studentExams._id)
    .populate({
      path: "CoursesExamed.courseId",
      select: "course_name credit_hour",
    });
  return res.status(200).json({ message: "done", result: populatedExams });
});

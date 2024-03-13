import SemesterModel from "../../../DB/models/semster.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addsemster = asyncHandler(async (req, res, next) => {
  const { name, level, Academic_Year, term, MinAvailableHours } = req.body;
  const chkname = await SemesterModel.findOne({ name: name });
  if (chkname) {
    return next(new Error("Semster name is already Exist", { cause: 400 }));
  }

  const semster = {
    name: name,
    level,
    Academic_Year,
    term,
    MinAvailableHours,
  };
  const result = await SemesterModel.create(semster);
  if (!result) {
    return next(new Error("ERROR Server try later", { cause: 500 }));
  }
  return res
    .status(201)
    .json({ message: "semster created successfully", result: { result } });
});

export const updatesemster = asyncHandler(async (req, res, next) => {
  const { name, level, Academic_Year, term, MinAvailableHours } = req.body;
  const { semesterId } = req.query;
  const semester = await SemesterModel.findById(semesterId);
  if (!semester) {
    return next(new Error("Invalid Semster Id", { cause: 400 }));
  }
  if (name && name != semester.name) {
    const chknamesemster = await SemesterModel.findOne({ name: name });
    if (chknamesemster && chknamesemster._id.toString() !== semesterId) {
      return next(new Error("Semster Name Is already Exist", { cause: 400 }));
    }
    semester.name = name;
  }

  semester.level = level || semester.level;
  semester.Academic_Year = Academic_Year || semester.Academic_Year;
  semester.term = term || semester.term;
  semester.MinAvailableHours = MinAvailableHours || semester.MinAvailableHours;
  const result = await SemesterModel.findByIdAndUpdate(semesterId, semester, {
    new: true,
  });
  if (!result) {
    return next(new Error("Unexpected Error :(", { cause: 500 }));
  }
  return res
    .status(200)
    .json({ message: "semester Is Updated SuccessFully", semester: result });
});

export const deletesemster = asyncHandler(async (req, res, next) => {
  const { semesterId } = req.query;
  const deletedSemester = await SemesterModel.findByIdAndDelete(semesterId);
  if (!deletedSemester) {
    return next(new Error("Invalid semester Id", { cause: 404 }));
  }
  res.json({
    message: "Semester deleted successfully",
    semester: deletedSemester,
  });
});

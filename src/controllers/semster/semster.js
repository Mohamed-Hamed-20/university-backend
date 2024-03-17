import semsterModel from "../../../DB/models/semster.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addsemster = asyncHandler(async (req, res, next) => {
  const { name, level, Academic_Year, term, MinAvailableHours } = req.body;
  const chkname = await semsterModel.findOne({ name: name });
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
  const result = await semsterModel.create(semster);
  if (!result) {
    return next(new Error("ERROR Server try later", { cause: 500 }));
  }
  return res
    .status(201)
    .json({ message: "semster created successfully", result: { result } });
});

export const updatesemster = asyncHandler(async (req, res, next) => {
  const { name, level, Academic_Year, term, MinAvailableHours } = req.body;
  const { semsterId } = req.query;
  const semster = await semsterModel.findById(semsterId);
  if (!semster) {
    return next(new Error("Invalid Semster Id", { cause: 400 }));
  }
  if (name && name != semster.name) {
    const chknamesemster = await semsterModel.findOne({ name: name });
    if (chknamesemster && chknamesemster._id.toString() !== semsterId) {
      return next(new Error("Semster Name Is already Exist", { cause: 400 }));
    }
    semster.name = name;
  }

  semster.level = level || semster.level;
  semster.Academic_Year = Academic_Year || semster.Academic_Year;
  semster.term = term || semster.term;
  semster.MinAvailableHours = MinAvailableHours || semster.MinAvailableHours;
  const result = await semsterModel.findByIdAndUpdate(semsterId, semster, {
    new: true,
  });
  if (!result) {
    return next(new Error("Unexpected Error :(", { cause: 500 }));
  }
  return res
    .status(200)
    .json({ message: "semster Is Updated SuccessFully", semster: result });
});

export const deletesemster = asyncHandler(async (req, res, next) => {
  const { semsterId } = req.query;
  const deletedsemster = await semsterModel.findByIdAndDelete(semsterId);
  if (!deletedsemster) {
    return next(new Error("Invalid semster Id", { cause: 404 }));
  }
  res.json({
    message: "semster deleted successfully",
    semster: deletedsemster,
  });
});

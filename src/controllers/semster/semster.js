import semsterModel from "../../../DB/models/semster.model.js";
import settingModel from "../../../DB/models/setting.model.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addsemster = asyncHandler(async (req, res, next) => {
  const { name, year, term, Max_Hours } = req.body;
  const chkname = await semsterModel.findOne({ name: name });
  if (chkname) {
    return next(new Error("Semster name is already Exist", { cause: 400 }));
  }

  const semster = {
    name: name,
    term,
    year,
    Max_Hours,
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
  const { name, year, term, Max_Hours } = req.body;
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

  semster.year = year || semster.year;
  semster.term = term || semster.term;
  semster.Max_Hours = Max_Hours;
  const result = await semster.save();
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

export const MainSemsterInfo = asyncHandler(async (req, res, next) => {
  const setting = await settingModel.findOne();
  const semster = await semsterModel.findById(setting.MainSemsterId);
  if (!semster) {
    return next(new Error("semster not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "semster Information", semster });
});

export const FindSemster = asyncHandler(async (req, res, next) => {
  const { semsterId } = req.query;
  const semster = await semsterModel.findById(semsterId);

  if (!semster) {
    return next(new Error("semsterId not found", { cause: 404 }));
  }
  // response
  return res
    .status(200)
    .json({ message: "semster Information", semster: semster });
});
export const searchsemster11 = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  const course = await CourseModel.findByIdAndDelete(courseId);
  if (!course) {
    return next(new Error("Invalid courseId", { cause: 404 }));
  }
  //response
  return res
    .status(200)
    .json({ message: "course delete Successfully", course });
});

export const searchsemster = asyncHandler(async (req, res, next) => {
  const allowFields = ["name", "year", "_id", "startDate", "term", "Max_Hours"];
  const searchFields = ["name", "year", "term"];

  const apiFeatureInstance = new ApiFeature(
    semsterModel.find(),
    req.query,
    allowFields
  )
    .search(searchFields)
    .pagination()
    .sort()
    .select()
    .filter();

  const semsters = await apiFeatureInstance.MongoseQuery;

  return res
    .status(200)
    .json({ message: "Done All semsters Information", semsters });
});

export const count = asyncHandler(async (req, res, next) => {
  console.log(req.query.num);
  const count = await CourseModel.find().countDocuments({});
  console.log(count);
  return res.json({ count: count });
});

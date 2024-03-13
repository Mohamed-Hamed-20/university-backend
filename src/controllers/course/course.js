import { adminModel } from "../../../DB/models/admin.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { InstructorModel } from "../../../DB/models/instructor.model.js";
import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { arrayofIds } from "../../utils/arrayobjectIds.js";
import { ApiFeature } from "../../utils/apiFeature.js";

export const addCourse = asyncHandler(async (req, res, next) => {
  const {
    course_name,
    Prerequisites,
    credit_hour,
    instructorId,
    OpenForRegistration,
    desc,
  } = req.body;

  const course = {};

  // Check if the course name already exists
  const chkcourse = await CourseModel.findOne({ course_name: course_name });
  if (chkcourse) {
    return next(new Error("Course name already exists", { status: 400 }));
  } else {
    course.course_name = course_name;
  }

  // Assign prerequisites if provided
  if (Prerequisites && Prerequisites.length > 0) {
    const prerequisiteIds = arrayofIds(Prerequisites);
    const foundPrerequisites = await CourseModel.find({
      _id: { $in: prerequisiteIds },
    });
    if (foundPrerequisites.length !== Prerequisites.length) {
      return next(
        new Error("One or more prerequisites are invalid", { cause: 400 })
      );
    }
    course.Prerequisites = foundPrerequisites;
  }

  // Check if instructorId is provided and valid
  if (instructorId) {
    const instructor = await InstructorModel.findById(instructorId);
    if (!instructor || instructor.role !== "instructor") {
      return next(new Error("Invalid instructorId", { status: 404 }));
    }
    course.instructorId = instructorId;
  }

  // Assign OpenForRegistration and description if provided
  if (OpenForRegistration) course.OpenForRegistration = OpenForRegistration;

  if (desc) course.desc = desc;

  // Assign credit hour
  course.credit_hour = credit_hour;

  // Create the course
  const result = await CourseModel.create(course);
  return res
    .status(201)
    .json({ message: "Course created successfully", course: result });
});

export const updatecourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.query;
  const {
    course_name,
    Prerequisites,
    credit_hour,
    instructorId,
    OpenForRegistration,
    desc,
  } = req.body;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new Error("Invalid course Id", { cause: 404 }));
  }
  if (course_name && course?.course_name != course_name) {
    console.log("couse check name");
    const chkcourse = await CourseModel.findOne({ course_name });
    if (chkcourse && chkcourse._id.toString() != courseId) {
      return next(new Error("course Name Is Already Exist ", { cause: 400 }));
    } else {
      course.course_name = course_name;
    }
  }

  if (Prerequisites && Prerequisites?.length > 0) {
    const prerequisiteIds = arrayofIds(Prerequisites);
    if (
      JSON.stringify(prerequisiteIds.sort()) !=
      JSON.stringify(course?.Prerequisites?.sort())
    ) {
      console.log("couse check Prerequisites");
      const foundPrerequisites = await CourseModel.find({
        _id: { $in: prerequisiteIds },
      });
      if (foundPrerequisites.length !== Prerequisites.length) {
        return next(
          new Error("One or more prerequisites are invalid", { cause: 400 })
        );
      }
      course.Prerequisites = foundPrerequisites;
    }
  }

  if (instructorId && instructorId != course?.instructorId?.toString()) {
    console.log("Insta check");
    const instructor = await InstructorModel.findById(instructorId);
    if (!instructor) {
      return next(new Error("Invalid instructor Id", { cause: 404 }));
    }
    course.instructorId = instructor._id;
  }

  if (credit_hour) course.credit_hour = credit_hour;

  if (OpenForRegistration) course.OpenForRegistration = OpenForRegistration;

  if (desc) course.desc = desc;

  await course.save();
  return res.status(200).json({ message: "course  Successfully", course });
});

export const deletecourse = asyncHandler(async (req, res, next) => {
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

export const searchcourse = asyncHandler(async (req, res, next) => {
  const allowFields = [
    "course_name",
    "desc",
    "_id",
    "credit_hour",
    "instructorId",
    "OpenForRegistration",
    "Prerequisites",
  ];
  const searchFields = ["course_name", "desc"];

  const apiFeatureInstance = new ApiFeature(
    CourseModel.find(),
    req.query,
    allowFields
  )
    .search(searchFields)
    .pagination()
    .sort()
    .select()
    .filter();

  const course = await apiFeatureInstance.MongoseQuery;

  return res
    .status(200)
    .json({ message: "Done All courses Information", course });
});

export const count = asyncHandler(async (req, res, next) => {
  console.log(req.query.num);
  const count = await CourseModel.find().countDocuments({});
  console.log(count);
  return res.json({ count: count });
});

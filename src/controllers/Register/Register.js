import RegisterModel from "../../../DB/models/Register.model.js";
import availableCoursesModel from "../../../DB/models/availableCourses.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { roles } from "../../middleware/auth.js";
import { ApiFeature } from "../../utils/apiFeature.js";
import { arrayofstring } from "../../utils/arrayobjectIds.js";
import { availableHoursForUser } from "../../utils/availableHours.js";
import { GetMultipleImages, GetsingleImg } from "../../utils/aws.s3.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { sanitizeStudent } from "../../utils/sanitize.data.js";

export const addToRegister = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { courseId } = req.query;
  // Get course information
  const course = await CourseModel.findById(courseId)
    .lean()
    .select("_id course_name credit_hour OpenForRegistration ");
  if (!course || course.OpenForRegistration !== true) {
    return next(
      new Error("Invaild courseId or Not Allow to register", { cause: 400 })
    );
  }
  // Get available courses for the user
  const availableCourses = await availableCoursesModel.findOne({
    studentId: userId,
  });

  if (!availableCourses) {
    return next(new Error("You don't have available courses!", { cause: 400 }));
  }

  // Check if the course is allowed to be registered
  if (!availableCourses.Available_Courses.toString().includes(courseId)) {
    return next(
      new Error("This course is not allowed to be registered", { cause: 400 })
    );
  }

  // Find user registration information
  const userRegisterInfo = await RegisterModel.findOne({ studentId: userId });

  // calculate GPA
  const TotalGpa = req?.user?.TotalGpa || 2;
  const totalCreditHours = req?.user?.totalCreditHours || 0;

  // Get available hours for the user
  const availableHours = await availableHoursForUser({
    TotalGpa: TotalGpa,
    totalCreditHours: totalCreditHours,
    RegisterInfo: userRegisterInfo,
    setting: req.setting,
  });

  const newHours = availableHours - parseInt(course.credit_hour);
  // Check if the user has enough available hours to add this course
  if (newHours < 0) {
    return next(
      new Error("Not enough hours to add this course", { cause: 400 })
    );
  }

  let result = null;
  // If the user doesn't have a registration document in the database
  if (!userRegisterInfo) {
    const coursesRegisterd = [courseId];
    const newRegister = {
      studentId: userId,
      Available_Hours: newHours,
      coursesRegisterd: coursesRegisterd,
    };
    result = await RegisterModel.create(newRegister);
  } else {
    // If the user has a registration document in the database
    if (userRegisterInfo.coursesRegisterd?.includes(courseId)) {
      return next(new Error("courseId is Already Registered", { cause: 400 }));
    }
    userRegisterInfo.coursesRegisterd.push(courseId);
    userRegisterInfo.Available_Hours = newHours;
    result = await userRegisterInfo.save();
  }

  if (!result) {
    return next(
      new Error("Failed to add course. Please try again later.", { cause: 500 })
    );
  }

  // Remove the course from the available courses list
  availableCourses.Available_Courses =
    availableCourses.Available_Courses.filter(
      (item) => item.toString() !== courseId.toString()
    );
  await availableCourses.save();

  return res.json({ message: "Course added successfully", result });
});

// Delete a course from the student's registration
export const deleteFromRegister = asyncHandler(async (req, res, next) => {
  // Extract user ID and course ID from the request
  const userId = req.user._id;
  const { courseId } = req.query;

  // Find the course using the provided course ID
  const course = await CourseModel.findById(courseId);

  // If the course doesn't exist, return an error
  if (!course || course.OpenForRegistration !== true) {
    return next(new Error("Invalid courseId", { cause: 400 }));
  }

  // Find the student's registration information
  const register = await RegisterModel.findOne({ studentId: userId });

  // If the student's registration information doesn't exist, return an error
  if (!register) {
    return next(new Error("Student not found in register", { cause: 400 }));
  }

  // If the course is not registered by the student, return an error
  if (!register.coursesRegisterd.includes(courseId)) {
    return next(new Error("Course is already not registered", { cause: 400 }));
  }

  // Filter out the course from the student's registered courses
  register.coursesRegisterd = register.coursesRegisterd.filter(
    (ele) => ele.toString() !== courseId.toString()
  );

  // Increase the available hours for the student by the credit hours of the deleted course
  register.Available_Hours += course.credit_hour;

  // Save the updated registration information
  const result = await register.save();

  // Send a success response with the updated registration information
  return res
    .status(200)
    .json({ message: "Course deleted successfully", result });
});

export const getRegister = asyncHandler(async (req, res, next) => {
  const { studentId } = req.query;
  let userId = req.user._id;

  if (req.user.role == roles.admin || req.user.role == roles.super) {
    userId = studentId.toString();
  }

  let register = await RegisterModel.findOne({ studentId: userId })
    .populate({
      path: "coursesRegisterd",
      select: "course_name credit_hour desc _id ImgUrls",
    })
    .lean();

  if (!register) {
    const createnewregister = {
      studentId: userId,
      Available_Hours: 0,
      coursesRegisterd: [],
    };
    register = await RegisterModel.create(createnewregister);
  }

  // تحميل الصور بسرعة
  if (register.coursesRegisterd.length > 0) {
    await Promise.all(
      register.coursesRegisterd.map(async (course) => {
        if (course?.ImgUrls?.length > 0) {
          course.images = await GetMultipleImages(course.ImgUrls);
          delete course.ImgUrls;
        }
      })
    );
  }



  return res
    .status(200)
    .json({ message: "Done", student: sanitizeStudent(req.user), register });
});

export const searchRegister = asyncHandler(async (req, res, next) => {
  const { courseId, studentId } = req.query;
  const user = req.user;

  // check if he is allowed to view this courses
  if (user.role == roles.instructor) {
    if (!courseId) {
      return next(new Error("courseId is required", { cause: 400 }));
    }

    //=======================================
    const Materials = await arrayofstring(user.Materials);
    if (!Materials.includes(courseId.toString())) {
      return next(
        new Error("You are not allowed to view who registered this course", {
          cause: 401,
        })
      );
    }
  }

  let filters = {};
  if (courseId) filters.coursesRegisterd = courseId;
  if (studentId) filters.studentId = studentId;

  const allowFields = ["studentId", "Available_Hours", "coursesRegisterd"];

  const optionStudent = {
    select:
      "Full_Name National_Id Student_Code department gender PhoneNumber Date_of_Birth",
    path: "studentId",
    match: {
      // Full_Name: { $regex: new RegExp("^" + req?.query?.search + "$", "i") },
    },
  };
  const optionCourse = {
    path: "coursesRegisterd",
    match: { _id: courseId },
    select: "course_name desc credit_hour",
  };

  const searchFieldsIds = ["studentId"];
  const searchFieldsText = ["studentId.Full_Name"];

  const apiFeatureInstance = new ApiFeature(
    RegisterModel.find(filters).lean(),
    req.query,
    allowFields
  )
    .pagination()
    .sort()
    .select()
    // .search({ searchFieldsText, searchFieldsIds })
    .populate(optionStudent)
    .populate(optionCourse);

  const results = await apiFeatureInstance.MongoseQuery;

  return res.status(200).json({
    message: "Done All Student Information",
    registers: results,
  });
});

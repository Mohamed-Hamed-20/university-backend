import RegisterModel from "../../../DB/models/Register.model.js";
import availableCoursesModel from "../../../DB/models/availableCourses.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { availableHoursForUser } from "../../utils/availableHours.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addToRegister = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const semsterId = req.user.semesterId;
  const { courseId } = req.query;
  // Get course information
  const course = await CourseModel.findById(courseId);
  if (!course || course.OpenForRegistration !== true) {
    return next(
      new Error("Invaild courseId or Not Allow to register", { cause: 400 })
    );
  }
  // Get available courses for the user
  const availableCourses = await availableCoursesModel.findOne({
    StudentId: userId,
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
  const userRegisterInfo = await RegisterModel.findOne({ StudentId: userId });

  // Get available hours for the user
  const availableHours = await availableHoursForUser({
    TotalGpa: availableCourses.TotalGpa,
    RegisterInfo: userRegisterInfo,
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
      StudentId: userId,
      Available_CoursesId: availableCourses._id,
      Available_Hours: newHours,
      coursesRegisterd: coursesRegisterd,
      semsterId: semsterId,
    };
    result = await RegisterModel.create(newRegister);
  } else {
    // If the user has a registration document in the database
    if (userRegisterInfo.coursesRegisterd?.includes(courseId)) {
      return next(new Error("courseId is Already Registered", { cause: 400 }));
    }
    userRegisterInfo.coursesRegisterd.push(courseId);
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

export const deleteFromRegister = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
});

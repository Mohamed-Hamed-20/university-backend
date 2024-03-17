import RegisterModel from "../../../DB/models/Register.model.js";
import { StudentGradeModel } from "../../../DB/models/StudentGrades.model.js";
import availableCoursesModel from "../../../DB/models/availableCourses.model.js";
import CourseModel from "../../../DB/models/course.model.js";
import { availableHoursForUser } from "../../utils/availableHours.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addToRegister = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const semsterId = req.user.semsterId;
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

  // Get student total crdit hour and Gpa total
  const userGrades = await StudentGradeModel.findOne({ studentId: userId });

  // Get available hours for the user
  const availableHours = await availableHoursForUser({
    TotalGpa: userGrades?.TotalGpa || 2,
    totalCreditHours: userGrades?.totalCreditHours || 0,
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
      studentId: userId,
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

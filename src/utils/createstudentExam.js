import RegisterModel from "../../DB/models/Register.model.js";
import {StudentGradeModel} from "../../DB/models/StudentGrades.model.js";
import CourseModel from "../../DB/models/course.model.js";

export const createStudentExams = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User Id not sent");
    }

    const newUserGrades = {
      studentId: userId,
      TotalGpa: 2,
      totalCreditHours: 0,
      GradeInsemster: [],
    };
    // create student grates
    const result = await StudentGradeModel.create(newUserGrades);

    if (!result) {
      throw new Error("Failed to create student");
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllValidCourses = async (passedCoursesIds, userId) => {
  // delete courses its already user register it
  const Registered = await RegisterModel.findOne({ studentId: userId });
  let newpassedCoursesIds = passedCoursesIds;
  if (Registered) {
    const coursesRegisterd = Registered.coursesRegisterd;
    newpassedCoursesIds = Array.from(
      new Set(passedCoursesIds.concat(coursesRegisterd))
    );
  }

  const newCourses = await CourseModel.find({
    _id: { $nin: newpassedCoursesIds },
    OpenForRegistration: true,
  });

  // filter only vaild courses
  const validCourses = newCourses.filter((course) => {
    if (!course?.Prerequisites || course.Prerequisites.length === 0) {
      return true;
    } else {
      return course.Prerequisites.every((ele) =>
        passedCoursesIds.toString().includes(ele.toString())
      );
    }
  });

  let validCoursesIds = [];
  for (const course of validCourses) {
    validCoursesIds.push(course._id);
  }

  return { validCoursesIds, validCourses };
};

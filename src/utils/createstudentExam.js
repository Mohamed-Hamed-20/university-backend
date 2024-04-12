import RegisterModel from "../../DB/models/Register.model.js";
import CourseModel from "../../DB/models/course.model.js";

export const getAllValidCourses = async ({
  passedCourses: passedCoursesIds,
  userId,
  studepartment,
}) => {
  // delete courses its already user register it
  const Registered = await RegisterModel.findOne({ studentId: userId }).lean();
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
  }).lean();

  // filter only vaild courses
  const validCourses = newCourses.filter((course) => {
    if (studepartment) {
      if (course.department && course.department.length > 0) {
        if (course.department.includes(studepartment)) {
          if (!course?.Prerequisites || course.Prerequisites.length === 0) {
            return true;
          } else {
            return course.Prerequisites.every((ele) =>
              passedCoursesIds.toString().includes(ele.toString())
            );
          }
        } else {
          return false;
        }
      } else {
        if (!course?.Prerequisites || course.Prerequisites.length === 0) {
          return true;
        } else {
          return course.Prerequisites.every((ele) =>
            passedCoursesIds.toString().includes(ele.toString())
          );
        }
      }
    } else {
      if (!course?.Prerequisites || course.Prerequisites.length === 0) {
        return true;
      } else {
        return course.Prerequisites.every((ele) =>
          passedCoursesIds.toString().includes(ele.toString())
        );
      }
    }
  });

  let validCoursesIds = [];
  for (const course of validCourses) {
    validCoursesIds.push(course._id);
  }

  return { validCoursesIds, validCourses };
};

// export const getAllValidCourses = async ({
//   passedCourses: passedCoursesIds,
//   userId,
//   studepartment,
// }) => {
//   try {
//     // Find registered courses for the user and extract registered course IDs
//     const aggregationPipeline = [
//       {
//         $match: { studentId: userId },
//       },
//       {
//         $project: {
//           registeredCourseIds: { $ifNull: ["$coursesRegisterd", []] },
//         },
//       },
//     ];

//     const [{ registeredCourseIds = [] }] = await RegisterModel.aggregate(
//       aggregationPipeline
//     );

//     // Find valid courses available for registration
//     const validCourses = await CourseModel.find({
//       _id: { $nin: [...passedCoursesIds, ...registeredCourseIds] }, // Exclude passed and registered courses
//       OpenForRegistration: true,
//       $or: [
//         { department: { $exists: false } }, // Course does not have a department
//         { department: studepartment }, // Course department matches the user's department
//         { department: null }, // Course does not have a department
//       ],
//       $or: [
//         { Prerequisites: { $exists: false } }, // Course has no prerequisites
//         { Prerequisites: { $size: 0 } }, // Course has no prerequisites
//         { Prerequisites: { $elemMatch: { $in: passedCoursesIds } } }, // User has passed all prerequisites
//       ],
//     });

//     const validCoursesIds = validCourses.map((course) => course._id);

//     return { validCoursesIds, validCourses };
//   } catch (error) {
//     // Handle error
//     console.error(error);
//     throw new Error("Failed to fetch valid courses");
//   }
// };

import SemesterModel from "../../../DB/models/semster.model.js";
import settingModel from "../../../DB/models/setting.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { routes } from "../../utils/routes.path.js";

const routedescription = [
  //student routes
  {
    name: "Student Login",
    url: `${routes.student._id}${routes.student.login}`,
    desc: "Allows students to log in to their accounts.",
  },
  {
    name: "Get Information for Student",
    url: `${routes.student._id}${routes.student.getInfo}`,
    desc: "Retrieves information about a specific student.",
  },
  {
    name: "Add Image to Student by Student",
    url: `${routes.student._id}${routes.student.AddImgByStu}`,
    desc: "Allows student to add an image to their own profile.",
  },
  {
    name: "Delete Image from Student by Student",
    url: `${routes.student._id}${routes.student.deleteImgBystu}`,
    desc: "Allows student to delete their own image from their profile.",
  },
  {
    name: "Get Available Courses for Students",
    url: `${routes.student._id}${routes.student.Availablecourses}`,
    desc: "Retrieves a list of courses available for students to enroll in.",
  },
  {
    name: "Search Courses by Student",
    url: `${routes.course._id}${routes.course.searchCourseByStu}`,
    desc: "Searches for courses based on criteria specified by a student.",
  },
  {
    name: "Get Single Course Information by Student",
    url: `${routes.course._id}${routes.course.GetsingleInfoByStu}`,
    desc: "Retrieves detailed information about a specific course for a student.",
  },
  {
    name: "Get Main Semester Information by Student",
    url: `${routes.semster._id}${routes.semster.MainSemsterInfoBystudent}`,
    desc: "Retrieves information about the main semester for a specific student.",
  },
  {
    name: "Get Single Training Information by Student",
    url: `${routes.Training._id}${routes.Training.singleTraininginfoBystudent}`,
    desc: "Retrieves detailed information about a specific training for a student.",
  },
  {
    name: "Get All Trainings Information by Student",
    url: `${routes.Training._id}${routes.Training.allTrainingBystudent}`,
    desc: "Retrieves information about all trainings for a student.",
  },
  {
    name: "Add Training to Register",
    url: `${routes.RegisterTraining._id}${routes.RegisterTraining.addTraining}`,
    desc: "Adds a training to a user's registration.",
  },
  {
    name: "Delete Training from Register",
    url: `${routes.RegisterTraining._id}${routes.RegisterTraining.deleteTraining}`,
    desc: "Deletes a training from a user's registration.",
  },
  {
    name: "Get Registered Training Information by Student",
    url: `${routes.RegisterTraining._id}${routes.RegisterTraining.getTrainingRegisterdInfoTostu}`,
    desc: "Retrieves information about registered trainings for a student.",
  },
  {
    name: "Get Single Training Result by Student",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.getSingleTrainingResultByStudent}`,
    desc: "Retrieves a single training result for a student.",
  },
  {
    name: "Search Training Results by Student",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.SearchTrainingResultByStudent}`,
    desc: "Searches for training results based on criteria specified by a student.",
  },
  // Routes for Admins
  {
    name: "Admin Login",
    url: `${routes.Admin._id}${routes.Admin.login}`,
    desc: "Allows administrators to log in to the system.",
  },
  {
    name: "Get Admin Information",
    url: `${routes.Admin._id}${routes.Admin.getinfoAdmin}`,
    desc: "Retrieves information about a specific admin.",
  },
  {
    name: "Get Super Admin Information",
    url: `${routes.Admin._id}${routes.Admin.getinfoSuper}`,
    desc: "Retrieves information about a super admin.",
  },
  {
    name: "Create Admin",
    url: `${routes.Admin._id}${routes.Admin.createAdmin}`,
    desc: "Creates a new admin account.",
  },
  {
    name: "Update Admin",
    url: `${routes.Admin._id}${routes.Admin.updateAdmin}`,
    desc: "Updates information for a specific admin.",
  },
  {
    name: "Delete Admin",
    url: `${routes.Admin._id}${routes.Admin.deleteAdmin}`,
    desc: "Deletes a specific admin account.",
  },
  {
    name: "Search for Admins",
    url: `${routes.Admin._id}${routes.Admin.searchAdmin}`,
    desc: "Searches for admins based on certain criteria.",
  },
  {
    name: "Add Image to Admin by Super Admin",
    url: `${routes.Admin._id}${routes.Admin.AddImgBySuper}`,
    desc: "Allows super admin to add an image to an admin's profile.",
  },
  {
    name: "Add Image to Admin by Admin",
    url: `${routes.Admin._id}${routes.Admin.AddImgByAdmin}`,
    desc: "Allows admin to add an image to another admin's profile.",
  },
  {
    name: "Delete Image from Admin by Super Admin",
    url: `${routes.Admin._id}${routes.Admin.deleteImgBysuper}`,
    desc: "Allows super admin to delete an image from an admin's profile.",
  },
  {
    name: "Delete Image from Admin by Admin",
    url: `${routes.Admin._id}${routes.Admin.deleteImgByAdmin}`,
    desc: "Allows admin to delete an image from another admin's profile.",
  },
  {
    name: "Admin Dashboard",
    url: `${routes.Admin._id}${routes.Admin.dashboardAdmin}`,
    desc: "Provides access to the admin dashboard.",
  },
  {
    name: "Create Student",
    url: `${routes.student._id}${routes.student.createStudent}`,
    desc: "Creates a new student account.",
  },
  {
    name: "Update Student",
    url: `${routes.student._id}${routes.student.updateStudent}`,
    desc: "Updates information for a specific student.",
  },
  {
    name: "Delete Student",
    url: `${routes.student._id}${routes.student.deleteStudent}`,
    desc: "Deletes a specific student account.",
  },
  {
    name: "Search for Students",
    url: `${routes.student._id}${routes.student.searchstudent}`,
    desc: "Searches for students based on certain criteria.",
  },
  {
    name: "Add Image to Student by Admin",
    url: `${routes.student._id}${routes.student.AddImgByAdmin}`,
    desc: "Allows admin to add an image to a student's profile.",
  },
  {
    name: "Delete Image from Student by Admin",
    url: `${routes.student._id}${routes.student.deleteImgByAdmin}`,
    desc: "Allows admin to delete an image from a student's profile.",
  },
  {
    name: "Instructor Information",
    url: `${routes.instructor._id}${routes.instructor.InstructorInfo}`,
    desc: "Retrieves information about a specific instructor.",
  },
  {
    name: "Create Instructor",
    url: `${routes.instructor._id}${routes.instructor.createInstructor}`,
    desc: "Creates a new instructor account.",
  },
  {
    name: "Update Instructor",
    url: `${routes.instructor._id}${routes.instructor.updateInstructor}`,
    desc: "Updates information for a specific instructor.",
  },
  {
    name: "Delete Instructor",
    url: `${routes.instructor._id}${routes.instructor.deleteInstructor}`,
    desc: "Deletes a specific instructor account.",
  },
  {
    name: "Search for Instructors",
    url: `${routes.instructor._id}${routes.instructor.searchInstructor}`,
    desc: "Searches for instructors based on certain criteria.",
  },
  {
    name: "Add Course",
    url: `${routes.course._id}${routes.course.AddCourse}`,
    desc: "Adds a new course to the system.",
  },
  {
    name: "Update Course",
    url: `${routes.course._id}${routes.course.updateCourse}`,
    desc: "Updates information for a specific course.",
  },
  {
    name: "Delete Course",
    url: `${routes.course._id}${routes.course.deleteCourse}`,
    desc: "Deletes a specific course.",
  },
  {
    name: "Add Images to Course",
    url: `${routes.course._id}${routes.course.AddCourseImg}`,
    desc: "Allows addition of images to a course.",
  },
  {
    name: "Delete Images from Course",
    url: `${routes.course._id}${routes.course.deleteCourseImg}`,
    desc: "Allows deletion of images from a course.",
  },
  {
    name: "Search Courses by Admin",
    url: `${routes.course._id}${routes.course.searchCourseByAdmin}`,
    desc: "Searches for courses based on criteria specified by an admin.",
  },
  {
    name: "Get Single Course Information by Admin",
    url: `${routes.course._id}${routes.course.GetsingleInfoByAdmin}`,
    desc: "Retrieves detailed information about a specific course for an admin.",
  },
  {
    name: "Add Semester",
    url: `${routes.semster._id}${routes.semster.addsemster}`,
    desc: "Adds a new semester to the system.",
  },
  {
    name: "Update Semester",
    url: `${routes.semster._id}${routes.semster.updatesemster}`,
    desc: "Updates information for a specific semester.",
  },
  {
    name: "Delete Semester",
    url: `${routes.semster._id}${routes.semster.deletesemster}`,
    desc: "Deletes a specific semester.",
  },
  {
    name: "Search Semesters",
    url: `${routes.semster._id}${routes.semster.searchsemster}`,
    desc: "Searches for semesters based on certain criteria.",
  },
  {
    name: "Get Main Semester Information by Admin",
    url: `${routes.semster._id}${routes.semster.MainSemsterInfoByAdmin}`,
    desc: "Retrieves information about the main semester for an admin.",
  },
  {
    name: "View Setting for Admin",
    url: `${routes.setting._id}${routes.setting.ViewSettingAdmin}`,
    desc: "Provides access to view system-wide settings for admin.",
  },
  {
    name: "Add Training",
    url: `${routes.Training._id}${routes.Training.AddTraining}`,
    desc: "Adds a new training to the system.",
  },
  {
    name: "Update Training",
    url: `${routes.Training._id}${routes.Training.updateTraining}`,
    desc: "Updates information for a specific training.",
  },
  {
    name: "Delete Training",
    url: `${routes.Training._id}${routes.Training.deleteTraining}`,
    desc: "Deletes a specific training.",
  },
  {
    name: "Add Images to Training",
    url: `${routes.Training._id}${routes.Training.AddImages}`,
    desc: "Allows addition of images to a training.",
  },
  {
    name: "Delete Images from Training",
    url: `${routes.Training._id}${routes.Training.deleteImages}`,
    desc: "Allows deletion of images from a training.",
  },
  {
    name: "Get Single Training Information by Admin",
    url: `${routes.Training._id}${routes.Training.singleTraininginfoByAdmin}`,
    desc: "Retrieves detailed information about a specific training for an admin.",
  },
  {
    name: "Get All Trainings Information by Admin",
    url: `${routes.Training._id}${routes.Training.allTrainingByAdmin}`,
    desc: "Retrieves information about all trainings for an admin.",
  },
  {
    name: "Search Registered Trainings by Admin",
    url: `${routes.RegisterTraining._id}${routes.RegisterTraining.searchTrainingsRegisterdByAdmin}`,
    desc: "Searches for registered trainings based on criteria specified by an admin.",
  },
  // Routes for Instructors
  {
    name: "Instructor Login",
    url: `${routes.instructor._id}${routes.instructor.login}`,
    desc: "Allows instructors to log in to their accounts.",
  },
  {
    name: "Add Image to Instructor by Instructor",
    url: `${routes.instructor._id}${routes.instructor.AddImgByInstructor}`,
    desc: "Allows instructor to add an image to their own profile.",
  },
  {
    name: "Add Image to Instructor by Admin",
    url: `${routes.instructor._id}${routes.instructor.AddImgByAdmin}`,
    desc: "Allows admin to add an image to an instructor's profile.",
  },
  {
    name: "Delete Image from Instructor by Instructor",
    url: `${routes.instructor._id}${routes.instructor.deleteImgByInstructor}`,
    desc: "Allows instructor to delete their own image from their profile.",
  },
  {
    name: "Delete Image from Instructor by Admin",
    url: `${routes.instructor._id}${routes.instructor.deleteImgByAdmin}`,
    desc: "Allows admin to delete an image from an instructor's profile.",
  },
  {
    name: "Search Courses by Instructor",
    url: `${routes.course._id}${routes.course.searchCourseByInstructor}`,
    desc: "Searches for courses based on criteria specified by an instructor.",
  },
  {
    name: "Get Single Course Information by Instructor",
    url: `${routes.course._id}${routes.course.GetsingleInfoByInstructor}`,
    desc: "Retrieves detailed information about a specific course for an instructor.",
  },
  {
    name: "Get Main Semester Information by Instructor",
    url: `${routes.semster._id}${routes.semster.MainSemsterInfoByInstructor}`,
    desc: "Retrieves information about the main semester for an instructor.",
  },
  {
    name: "Get Single Training Information by Instructor",
    url: `${routes.Training._id}${routes.Training.singleTraininginfoByinstructor}`,
    desc: "Retrieves detailed information about a specific training for an instructor.",
  },
  {
    name: "Get All Trainings Information by Instructor",
    url: `${routes.Training._id}${routes.Training.allTrainingByinstructor}`,
    desc: "Retrieves information about all trainings for an instructor.",
  },
  {
    name: "Search Registered Trainings by Instructor",
    url: `${routes.RegisterTraining._id}${routes.RegisterTraining.searchTrainingsRegisterdByInstructor}`,
    desc: "Searches for registered trainings based on criteria specified by an instructor.",
  },
  {
    name: "Upload Training Result by Admin",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.uploadByAdmin}`,
    desc: "Uploads a training result by an admin.",
  },
  {
    name: "Update Training Result by Admin",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.updateByAdmin}`,
    desc: "Updates a training result by an admin.",
  },
  {
    name: "Delete Training Result by Admin",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.deleteByAdmin}`,
    desc: "Deletes a training result by an admin.",
  },
  {
    name: "Get Single Training Result by Admin",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.getSingleTrainingResultByAdmin}`,
    desc: "Retrieves a single training result for an admin.",
  },
  {
    name: "Search Training Results by Admin",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.SearchTrainingResultByAdmin}`,
    desc: "Searches for training results based on criteria specified by an admin.",
  },
  {
    name: "Upload Training Result by Instructor",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.uploadByInstructor}`,
    desc: "Uploads a training result by an instructor.",
  },
  {
    name: "Update Training Result by Instructor",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.updateByInstructor}`,
    desc: "Updates a training result by an instructor.",
  },
  {
    name: "Delete Training Result by Instructor",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.deleteByInstructor}`,
    desc: "Deletes a training result by an instructor.",
  },
  {
    name: "Get Single Training Result by Instructor",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.getSingleTrainingResultByInstructor}`,
    desc: "Retrieves a single training result for an instructor.",
  },
  {
    name: "Search Training Results by Instructor",
    url: `${routes.TrainingResult._id}${routes.TrainingResult.SearchTrainingResultByInstructor}`,
    desc: "Searches for training results based on criteria specified by an instructor.",
  },
];

export const updateSetting = asyncHandler(async (req, res, next) => {
  const { deniedRoutes, MainSemsterId, MaxAllowTrainingToRegister } = req.body;

  // Find the existing setting or create a new one if it doesn't exist
  let setting = req.setting;

  if (!setting) {
    if (!MainSemsterId) {
      return next(new Error("You need to provide SemsterId", { cause: 400 }));
    }
    // check this semster Vaild
    const semster = await SemesterModel.findById(MainSemsterId);
    if (!semster) {
      return next(new Error("Invalid SemsterId not found", { cause: 404 }));
    }

    //new doc
    const newSetting = {
      MainSemsterId: semster._id,
      deniedRoutes: [],
      MaxAllowTrainingToRegister: MaxAllowTrainingToRegister || 0,
    };

    //create new doc
    setting = await settingModel.create(newSetting);
    if (!setting) {
      return next(new Error("Server Error", { cause: 500 }));
    }
  }

  // Update the setting based on the provided data
  if (deniedRoutes) {
    setting.deniedRoutes = deniedRoutes;
  }

  // Check if MainSemsterId is provided and update it if it's different
  if (
    MainSemsterId &&
    setting.MainSemsterId.toString() !== MainSemsterId.toString()
  ) {
    const semster = await SemesterModel.findById(MainSemsterId);
    if (!semster) {
      return next(new Error("Invalid SemsterId not found", { cause: 404 }));
    }
  }

  // Update MaxAllowTrainingToRegister if provided
  if (MaxAllowTrainingToRegister)
    setting.MaxAllowTrainingToRegister = MaxAllowTrainingToRegister;

  // Save the updated setting
  const result = await setting.save();
  return res
    .status(200)
    .json({ message: "Setting updated successfully", setting: result });
});

export const deleteSetting = asyncHandler(async (req, res, next) => {});

// ViewSetting
export const ViewSetting = asyncHandler(async (req, res, next) => {
  const setting = req.setting;
  for (const Api of routedescription) {
    if (setting.deniedRoutes.includes(Api.url)) {
      Api.allow = "no";
    } else {
      Api.allow = "yes";
    }
  }
  return res
    .status(200)
    .json({ message: "All setting Information", routedescription, setting });
});

// settingAPIS
export const settingAPIS = asyncHandler(async (req, res, next) => {
  const setting = await settingModel.findOne();

  if (setting.deniedRoutes.includes(req.path)) {
    return next(new Error("Access to this service is denied", { cause: 403 }));
  }

  req.setting = setting;
  return next();
});

import SemesterModel from "../../../DB/models/semster.model.js";
import settingModel from "../../../DB/models/setting.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const updateSetting = asyncHandler(async (req, res, next) => {
  const {
    StudentLogin,
    StudentRegister,
    StudentViewGrates,
    StudentViewAvailablecourses,
    InstructorLogin,
    InstructoruploadsGrates,
    AdminLogin,
    AdminEditStudent,
    AdminEditInstructor,
    AdminEditTraining,
    AdminEditSemster,
    AdminEditCourses,
    AdminEditRegister,
    MainSemsterId,
  } = req.body;

  const studentLoginRoutes = [
    "/Api/user/login",
    "/Api/user/getuser",
    "/Api/student/register/addCourse",
    "/Api/student/register/deleteCourse",
    "/Api/student/register/getRegister",
    "/Api/student/Availablecourses",
  ];
  const StudentRegisterRoutes = [
    "/Api/student/register/addCourse",
    "/Api/student/register/deleteCourse",
    "/Api/student/register/getRegister",
  ];

  const StudentViewGratesRoutes = [""];

  let setting = await settingModel.findOne();
  //if not setting Create One
  if (!setting) {
    if (!MainSemsterId) {
      return next(new Error("you need to provied SemsterId"));
    }
    const semster = await SemesterModel.findById(MainSemsterId);
    // if not semster found
    if (!semster) {
      return next(new Error("Invaild SemsterId not found", { cause: 404 }));
    }

    const newsetting = {
      MainSemsterId: semster._id,
    };
    setting = await settingModel.create(newsetting);
    if (!setting) {
      return next(new Error("server Error", { cause: 500 }));
    }
  }

  if (typeof StudentLogin === "boolean") {
    setting.StudentLogin = StudentLogin;
    if (StudentLogin === false) {
    }
  }

  if (typeof StudentRegister === "boolean") {
    setting.StudentRegister = StudentRegister;
  }

  if (typeof StudentViewGrates === "boolean") {
    setting.StudentViewGrates = StudentViewGrates;
  }

  if (typeof StudentViewAvailablecourses === "boolean") {
    setting.StudentViewAvailablecourses = StudentViewAvailablecourses;
  }

  if (typeof InstructorLogin === "boolean") {
    setting.InstructorLogin = InstructorLogin;
  }

  if (typeof InstructoruploadsGrates === "boolean") {
    setting.InstructoruploadsGrates = InstructoruploadsGrates;
  }

  if (typeof AdminLogin === "boolean") {
    setting.AdminLogin = AdminLogin;
  }

  if (typeof AdminEditStudent === "boolean") {
    setting.AdminEditStudent = AdminEditStudent;
  }

  if (typeof AdminEditInstructor === "boolean") {
    setting.AdminEditInstructor = AdminEditInstructor;
  }

  if (typeof AdminEditTraining === "boolean") {
    setting.AdminEditTraining = AdminEditTraining;
  }

  if (typeof AdminEditSemster === "boolean") {
    setting.AdminEditSemster = AdminEditSemster;
  }

  if (typeof AdminEditCourses === "boolean") {
    setting.AdminEditCourses = AdminEditCourses;
  }

  if (typeof AdminEditRegister === "boolean") {
    setting.AdminEditRegister = AdminEditRegister;
  }
  const result = await setting.save();
  return res
    .status(200)
    .json({ message: "setting updated successfully", setting: result });
});

export const deleteSetting = asyncHandler(async (req, res, next) => {});

export const ViewSetting = asyncHandler(async (req, res, next) => {});

export const Setting = asyncHandler(async (req, res, next) => {});

import { Router } from "express";
import * as cc from "../controllers/course/course.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/course/coursevalid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { routes } from "../utils/routes.path.js";
const router = Router();

const { course } = routes;
//user routes

// router.post("/login", valid(vSchema.login), uc.login);

router.post(
  `${course.AddCourse}`,
  valid(vSchema.addcourse),
  isAuth([roles.admin]),
  cc.addCourse
);

router.put(
  `${course.updateCourse}`,
  valid(vSchema.updatecourse),
  isAuth([roles.admin]),
  cc.updatecourse
);

router.delete(
  `${course.deleteCourse}`,
  valid(vSchema.deletecourse),
  isAuth([roles.admin]),
  cc.deletecourse
);

//upload one or more image
router.post(
  `${course.AddCourseImg}`,
  multerCloud(allowedExtensions.Image).array("courseImage", 3),
  valid(vSchema.AddcourseImg),
  isAuth([roles.admin]),
  cc.AddcourseImg
);

router.patch(
  `${course.deleteCourseImg}`,
  valid(vSchema.deletecourseImg),
  isAuth([roles.admin]),
  cc.deletecourseImg
);

// =========================================================================================

// EDIT_R   student
router.get(
  `${course.searchCourseByStu}`,
  valid(vSchema.searchcourse),
  isAuth([roles.stu]),
  cc.searchcourse
);

// EDIT_R   admin
router.get(
  `${course.searchCourseByAdmin}`,
  valid(vSchema.searchcourse),
  isAuth([roles.admin]),
  cc.searchcourse
);

//   EDIT_R     instructor
router.get(
  `${course.searchCourseByInstructor}`,
  valid(vSchema.searchcourse),
  isAuth([roles.instructor]),
  cc.searchcourse
);

// ============================================================================================

//   EDIT_R     admin courseInfo
router.get(
  `${course.GetsingleInfoByAdmin}`,
  valid(vSchema.deletecourse),
  isAuth([roles.admin]),
  cc.courseInfo
);

//   EDIT_R     student
router.get(
  `${course.GetsingleInfoByStu}`,
  valid(vSchema.deletecourse),
  isAuth([roles.stu]),
  cc.courseInfo
);

// EDIT_R     instructor
router.get(
  `${course.GetsingleInfoByInstructor}`,
  valid(vSchema.deletecourse),
  isAuth([roles.instructor]),
  cc.courseInfo
);

export default router;

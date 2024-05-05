import { Router } from "express";
import * as cc from "../controllers/course/course.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/course/coursevalid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();

const { course } = routes;

// create course
router.post(
  `${course.AddCourse}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.addcourse),
  isAuth([roles.admin]),
  cc.addCourse
);

// Update course
router.put(
  `${course.updateCourse}`,
  limiter({ limit: 30, Mintute: 60 }),
  valid(vSchema.updatecourse),
  isAuth([roles.admin]),
  cc.updatecourse
);

// delete course
router.delete(
  `${course.deleteCourse}`,
  limiter({ limit: 20, Mintute: 60 }),
  valid(vSchema.deletecourse),
  isAuth([roles.admin]),
  cc.deletecourse
);

//upload one or more image to course
router.post(
  `${course.AddCourseImg}`,
  limiter({ limit: 60, Mintute: 60 }),
  multerCloud(allowedExtensions.Image).array("courseImage", 3),
  valid(vSchema.AddcourseImg),
  isAuth([roles.admin, roles.super]),
  cc.AddcourseImg
);

// delete Imgae to course
router.patch(
  `${course.deleteCourseImg}`,
  limiter({ limit: 60, Mintute: 60 }),
  valid(vSchema.deletecourseImg),
  isAuth([roles.admin]),
  cc.deletecourseImg
);

// search for courses by student
router.get(
  `${course.searchCourseByStu}`,
  limiter({ limit: 35, Mintute: 15 }),
  valid(vSchema.searchcourse),
  isAuth([roles.stu]),
  cc.searchcourse
);

// search for courses by admin
router.get(
  `${course.searchCourseByAdmin}`,
  limiter({ limit: 40, Mintute: 15 }),
  valid(vSchema.searchcourse),
  isAuth([roles.admin, roles.super]),
  cc.searchcourse
);

// search for courses by instructor
router.get(
  `${course.searchCourseByInstructor}`,
  limiter({ limit: 40, Mintute: 15 }),
  valid(vSchema.searchcourse),
  isAuth([roles.instructor]),
  cc.searchcourse
);

// Get single course Information by admin
router.get(
  `${course.GetsingleInfoByAdmin}`,
  limiter({ limit: 50, Mintute: 15 }),
  valid(vSchema.deletecourse),
  isAuth([roles.admin, roles.super]),
  cc.courseInfo
);

// Get single course Information by student
router.get(
  `${course.GetsingleInfoByStu}`,
  limiter({ limit: 50, Mintute: 15 }),
  valid(vSchema.deletecourse),
  isAuth([roles.stu]),
  cc.courseInfo
);

// Get single course Information by instructor
router.get(
  `${course.GetsingleInfoByInstructor}`,
  limiter({ limit: 50, Mintute: 15 }),
  valid(vSchema.deletecourse),
  isAuth([roles.instructor]),
  cc.courseInfo
);

export default router;

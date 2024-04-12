import { Router } from "express";
import * as cc from "../controllers/course/course.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/course/coursevalid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
const router = Router();

//user routes

// router.post("/login", valid(vSchema.login), uc.login);

router.post(
  "/addcourse",
  valid(vSchema.addcourse),
  isAuth([roles.admin]),
  cc.addCourse
);
router.put(
  "/updatecourse",
  valid(vSchema.updatecourse),
  isAuth([roles.admin]),
  cc.updatecourse
);

router.delete(
  "/deletecourse",
  valid(vSchema.deletecourse),
  isAuth([roles.admin]),
  cc.deletecourse
);
router.get(
  "/searchcourse",
  // valid(vSchema.searchcourse),
  isAuth([roles.admin, roles.instructor]),
  cc.searchcourse
);

//upload one or more image
router.post(
  "/Add/images",
  multerCloud(allowedExtensions.Image).array("courseImage", 3),
  valid(vSchema.AddcourseImg),
  isAuth([roles.admin]),
  cc.AddcourseImg
);

router.patch(
  "/delete/images",
  valid(vSchema.deletecourseImg),
  isAuth([roles.admin]),
  cc.deletecourseImg
);

router.get(
  "/course/info",
  valid(vSchema.deletecourse),
  isAuth([roles.admin, roles.instructor, roles.stu]),
  cc.courseInfo
);
// router.get("/count", cc.count);
// missed login with Gmail   <<<<=====
export default router;

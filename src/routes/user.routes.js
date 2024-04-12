import { Router } from "express";
import * as uc from "../controllers/user/user.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/user/user.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
const router = Router();

//user routes

router.post("/login", valid(vSchema.login), uc.login);

router.post(
  "/addStudent",
  valid(vSchema.registeruser),
  isAuth([roles.admin]),
  uc.addStudent
);

router.get(
  "/getuser",
  // valid(vSchema.Getstudent),
  isAuth([roles.stu]),
  uc.Getuser
);

router.put(
  "/updateStudent",
  valid(vSchema.updateStudent),
  isAuth([roles.admin]),
  uc.updateStudent
);

router.delete(
  "/deleteStudent",
  valid(vSchema.deleteStudent),
  isAuth([roles.admin]),
  uc.deleteStudent
);

router.get(
  "/searchuser",
  valid(vSchema.searchuser),
  isAuth([roles.admin, roles.instructor]),
  uc.searchuser
);

//upload one or more image
router.post(
  "/Add/image",
  multerCloud(allowedExtensions.Image).single("studentImage"),
  valid(vSchema.AddStuImg),
  isAuth([roles.admin]),
  uc.AddStuImg
);

router.patch(
  "/delete/image",
  valid(vSchema.deleteStuImg),
  isAuth([roles.admin]),
  uc.deleteStuImg
);
router.post("/uploadImg", multerCloud(allowedExtensions.Image).single("image"));
export default router;

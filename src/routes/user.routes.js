import { Router } from "express";
import * as uc from "../controllers/user/user.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/user/user.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { routes } from "../utils/routes.path.js";
import { limiter } from "../utils/apply.security.js";
const router = Router();
const { student } = routes;
//user routes

router.post(
  `${student.login}`,
  limiter({ limit: 12, Mintute: 10 }),
  valid(vSchema.login),
  uc.login
);

router.get(
  `${student.getInfo}`,
  limiter({ limit: 20, Mintute: 5 }),
  isAuth([roles.stu]),
  uc.Getuser
);

router.get(
  `${student.getInfoAdmin}`,
  limiter({ limit: 20, Mintute: 5 }),
  valid(vSchema.studentInformation),
  isAuth([roles.admin, roles.super]),
  uc.studentInformation
);

router.post(
  `${student.createStudent}`,
  limiter({ limit: 50, Mintute: 15 }),
  valid(vSchema.registeruser),
  isAuth([roles.admin]),
  uc.addStudent
);

router.put(
  `${student.updateStudent}`,
  limiter({ limit: 40, Mintute: 15 }),
  valid(vSchema.updateStudent),
  isAuth([roles.admin]),
  uc.updateStudent
);

router.delete(
  `${student.deleteStudent}`,
  limiter({ limit: 15, Mintute: 20 }),
  valid(vSchema.deleteStudent),
  isAuth([roles.admin]),
  uc.deleteStudent
);

router.get(
  `${student.searchstudent}`,
  limiter({ limit: 22, Mintute: 5 }),
  valid(vSchema.searchuser),
  isAuth([roles.admin, roles.super]),
  uc.searchuser
);

// upload Images to student BY ADMIN

router.post(
  `${student.AddImgByAdmin}`,
  limiter({ limit: 25, Mintute: 40 }),
  multerCloud(allowedExtensions.Image).single("studentImage"),
  valid(vSchema.AddStuImg),
  isAuth([roles.admin]),
  uc.AddStuImg
);

// upload Images to student BY student
router.post(
  `${student.AddImgByStu}`,
  limiter({ limit: 8, Mintute: 24 * 60 }),
  multerCloud(allowedExtensions.Image).single("studentImage"),
  isAuth([roles.stu]),
  uc.AddStuImg
);

// delete Images to student BY ADMIN
router.patch(
  `${student.deleteImgByAdmin}`,
  limiter({ limit: 20, Mintute: 15 }),
  valid(vSchema.deleteStuImg),
  isAuth([roles.admin]),
  uc.deleteStuImg
);

// delete Images to student BY student
router.patch(
  `${student.deleteImgBystu}`,
  limiter({ limit: 9, Mintute: 24 * 60 }),
  // valid(vSchema.StudeleteStuImg),
  isAuth([roles.stu]),
  uc.deleteStuImg
);

// router logout
router.get(
  `${student.logout}`,
  limiter({ limit: 12, Mintute: 10 }),
  isAuth([roles.stu]),
  uc.logout
);

router.get(
  `${student.GetQR}`,
  limiter({ limit: 3, Mintute: 60 }),
  isAuth([roles.stu]),
  uc.getqr
);

export default router;

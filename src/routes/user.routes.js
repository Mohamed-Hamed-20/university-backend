import { Router } from "express";
import * as uc from "../controllers/user/user.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/user/user.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const {student} = routes
//user routes

router.post(`${student.login}`, valid(vSchema.login), uc.login);

router.post(
  `${student.createStudent}`,
  valid(vSchema.registeruser),
  isAuth([roles.admin]),
  uc.addStudent
);

router.get(`${student.getInfo}`, isAuth([roles.stu]), uc.Getuser);

router.put(
  `${student.updateStudent}`,
  valid(vSchema.updateStudent),
  isAuth([roles.admin]),
  uc.updateStudent
);

router.delete(
  `${student.deleteStudent}`,
  valid(vSchema.deleteStudent),
  isAuth([roles.admin]),
  uc.deleteStudent
);

router.get(
  `${student.searchstudent}`,
  valid(vSchema.searchuser),
  isAuth([roles.admin]),
  uc.searchuser
);

//upload Images admin  ======>   EDIT_R
router.post(
  `${student.AddImgByAdmin}`,
  multerCloud(allowedExtensions.Image).single("studentImage"),
  valid(vSchema.AddStuImg),
  isAuth([roles.admin]),
  uc.AddStuImg
);

//upload Images student  ======>  EDIT_R

router.post(
  `${student.AddImgByStu}`,
  multerCloud(allowedExtensions.Image).single("studentImage"),
  isAuth([roles.stu]),
  uc.AddStuImg
);

//delete Images admin  ======>  EDIT_R

router.patch(
  `${student.deleteImgByAdmin}`,
  valid(vSchema.deleteStuImg),
  isAuth([roles.admin]),
  uc.deleteStuImg
);

//delete Images student  ======>  EDIT_R

router.patch(
  `${student.deleteImgBystu}`,
  valid(vSchema.StudeleteStuImg),
  isAuth([roles.stu]),
  uc.deleteStuImg
);

export default router;

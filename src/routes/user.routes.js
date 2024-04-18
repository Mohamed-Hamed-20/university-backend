import { Router } from "express";
import * as uc from "../controllers/user/user.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/user/user.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { routes } from "../utils/routes.path.js";
import { limiter } from "../utils/apply.security.js";
const router = Router();
const {student} = routes
//user routes

router.post(`${student.login}`,limiter({limit:10,Mintute:15}), valid(vSchema.login), uc.login);

router.post(
  `${student.createStudent}`,
  limiter({limit:50,Mintute:15}),
  valid(vSchema.registeruser),
  isAuth([roles.admin]),
  uc.addStudent
);

router.get(`${student.getInfo}`,limiter({limit:10,Mintute:20}), isAuth([roles.stu]), uc.Getuser);

router.put(
  `${student.updateStudent}`,
  limiter({limit:50,Mintute:15}),
  valid(vSchema.updateStudent),
  isAuth([roles.admin]),
  uc.updateStudent
);

router.delete(
  `${student.deleteStudent}`,
  limiter({limit:15,Mintute:20}),
  valid(vSchema.deleteStudent),
  isAuth([roles.admin]),
  uc.deleteStudent
);

router.get(
  `${student.searchstudent}`,
  limiter({limit:20,Mintute:10}),
  valid(vSchema.searchuser),
  isAuth([roles.admin]),
  uc.searchuser
);

//upload Images admin  ======>   EDIT_R
router.post(
  `${student.AddImgByAdmin}`,
  limiter({limit:25,Mintute:60}),
  multerCloud(allowedExtensions.Image).single("studentImage"),
  valid(vSchema.AddStuImg),
  isAuth([roles.admin]),
  uc.AddStuImg
);

//upload Images student  ======>  EDIT_R

router.post(
  `${student.AddImgByStu}`,
  limiter({limit:8,Mintute:24*60}),
  multerCloud(allowedExtensions.Image).single("studentImage"),
  isAuth([roles.stu]),
  uc.AddStuImg
);

//delete Images admin  ======>  EDIT_R

router.patch(
  `${student.deleteImgByAdmin}`,
  limiter({limit:20,Mintute:15}),
  valid(vSchema.deleteStuImg),
  isAuth([roles.admin]),
  uc.deleteStuImg
);

//delete Images student  ======>  EDIT_R

router.patch(
  `${student.deleteImgBystu}`,
  limiter({limit:8,Mintute:24*60}),
  valid(vSchema.StudeleteStuImg),
  isAuth([roles.stu]),
  uc.deleteStuImg
);

export default router;

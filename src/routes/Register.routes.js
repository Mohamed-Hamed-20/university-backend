import { Router } from "express";
import * as acc from "../controllers/Register/Register.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/Register/Register.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { courseRegister } = routes;
//login admin SuperAdmins

router.post(
  `${courseRegister.addCourse}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.addToRegister),
  isAuth([roles.stu]),
  acc.addToRegister
);

router.patch(
  `${courseRegister.deleteCourse}`,
  limiter({ limit: 30, Mintute: 60 }),
  isAuth([roles.stu]),
  valid(vSchema.deleteFromRegister),
  acc.deleteFromRegister
);

//EDIT_R  Admin
router.get(
  `${courseRegister.GetRegisterInfoByAdmin}`,
  limiter({ limit: 100, Mintute: 60 }),
  valid(vSchema.getRegisterAdmin),
  isAuth([roles.admin, roles.super]),
  acc.getRegister
);

//EDIT_R student
router.get(
  `${courseRegister.GetRegisterInfoByStudent}`,
  limiter({ limit: 50, Mintute: 60 }),
  isAuth([roles.stu]),
  acc.getRegister
);

// ========================================================================================

//EDIT_R Admin
router.get(
  `${courseRegister.searchRegisterByAdmin}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.searchRegister),
  isAuth([roles.admin, roles.super]),
  acc.searchRegister
);

//EDIT_R instrctor
router.get(
  `${courseRegister.searchRegisterByInstructor}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.searchRegisterInstructor),
  isAuth([roles.instructor]),
  acc.searchRegister
);

export default router;

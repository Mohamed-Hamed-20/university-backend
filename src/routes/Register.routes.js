import { Router } from "express";
import * as acc from "../controllers/Register/Register.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/Register/Register.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { courseRegister } = routes;
//login admin SuperAdmins

router.post(
  `${courseRegister.addCourse}`,
  valid(vSchema.addToRegister),
  isAuth([roles.stu]),
  acc.addToRegister
);

router.patch(
  `${courseRegister.deleteCourse}`,
  isAuth([roles.stu]),
  valid(vSchema.deleteFromRegister),
  acc.deleteFromRegister
);

//EDIT_R  Admin
router.get(
  `${courseRegister.GetRegisterInfoByAdmin}`,
  valid(vSchema.getRegisterAdmin),
  isAuth([roles.admin]),
  acc.getRegister
);

//EDIT_R student
router.get(
  `${courseRegister.GetRegisterInfoByStudent}`,
  isAuth([roles.stu]),
  acc.getRegister
);

// ========================================================================================

//EDIT_R Admin
router.get(
  `${courseRegister.searchRegisterByAdmin}`,
  valid(vSchema.searchRegister),
  isAuth([roles.admin]),
  acc.searchRegister
);

//EDIT_R instrctor
router.get(
  `${courseRegister.searchRegisterByInstructor}`,
  valid(vSchema.searchRegisterInstructor),
  isAuth([roles.instructor]),
  acc.searchRegister
);

export default router;

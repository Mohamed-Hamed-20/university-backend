import { Router } from "express";
import * as acc from "../controllers/Register/Register.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/Register/Register.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//login admin SuperAdmins
router.post(
  "/addCourse",
  valid(vSchema.addToRegister),
  isAuth([roles.admin, roles.stu]),
  acc.addToRegister
);

router.patch(
  "/deleteCourse",
  isAuth([roles.admin, roles.stu]),
  valid(vSchema.deleteFromRegister),
  acc.deleteFromRegister
);

export default router;

import { Router } from "express";
import * as acc from "../controllers/AvailableCourses/AvailableCourses.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/admin/admin.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//login admin SuperAdmins
router.post(
  "/Availablecourses",
  isAuth([roles.admin, roles.stu]),
  acc.availableCourses
);

export default router;

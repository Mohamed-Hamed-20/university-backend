import { Router } from "express";
import * as cc from "../controllers/course/course.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/course/coursevalid.js";
import { isAuth, roles } from "../middleware/auth.js";
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

// router.get("/count", cc.count);
// missed login with Gmail   <<<<=====
export default router;

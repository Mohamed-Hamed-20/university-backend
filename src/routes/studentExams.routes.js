import { Router } from "express";
import * as sec from "../controllers/studentExams/studentExams.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

router.post(
  "/addstudentExams",
  //   valid(vSchema.addtrain),
  isAuth([roles.admin]),
  sec.addstudentExams
);

export default router;

import { Router } from "express";
import * as trc from "../controllers/trainingResult/trainingResult.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/trainingResult/trainingResult.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

router.post(
  "/upload",
  valid(vSchema.createTrainingResult),
  isAuth([roles.admin, roles.instructor]),
  trc.uploadTrainingResult
);

router.delete(
  "/delete",
  valid(vSchema.deleteTrainingResult),
  isAuth([roles.admin, roles.instructor]),
  trc.deleteTrainingResult
);
//upload trainig Information
router.put(
  "/update",
  valid(vSchema.updateTrainingResult),
  isAuth([roles.admin, roles.instructor]),
  trc.updateTrainingResult
);

router.get(
  "/getSingleTrainingResult",
  valid(vSchema.getSingleTrainingResult),
  isAuth([roles.stu, roles.admin, roles.instructor]),
  trc.getSingleTrainingResult
);
router.get(
  "/SearchTrainingResult",
  valid(vSchema.SearchTrainingResult),
  isAuth([roles.admin, roles.instructor, roles.stu]),
  trc.SearchTrainingResult
);
export default router;

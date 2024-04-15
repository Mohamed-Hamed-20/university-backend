import { Router } from "express";
import * as trc from "../controllers/trainingResult/trainingResult.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/trainingResult/trainingResult.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { TrainingResult } = routes;
//upload Traing Grade by admin  ======>   EDIT_R
router.post(
  `${TrainingResult.uploadByAdmin}`,
  valid(vSchema.createTrainingResult),
  isAuth([roles.admin]),
  trc.uploadTrainingResult
);

//upload Traing Grade by instructor  ======>   EDIT_R
router.post(
  `${TrainingResult.uploadByInstructor}`,
  valid(vSchema.createTrainingResult),
  isAuth([roles.instructor]),
  trc.uploadTrainingResult
);
// ================================

//delete Traing Grade by admin  ======>   EDIT_R
router.delete(
  `${TrainingResult.deleteByAdmin}`,
  valid(vSchema.deleteTrainingResult),
  isAuth([roles.admin]),
  trc.deleteTrainingResult
);

//delete Traing Grade by instructor  ======>   EDIT_R
router.delete(
  `${TrainingResult.deleteByInstructor}`,
  valid(vSchema.deleteTrainingResult),
  isAuth([roles.instructor]),
  trc.deleteTrainingResult
);
//===========================================

//update trainig Information by admin  EDIT_R
router.put(
  `${TrainingResult.updateByAdmin}`,
  valid(vSchema.updateTrainingResult),
  isAuth([roles.admin]),
  trc.updateTrainingResult
);

//update training Information by instructor   EDIT_R
router.put(
  `${TrainingResult.updateByInstructor}`,
  valid(vSchema.updateTrainingResult),
  isAuth([roles.instructor]),
  trc.updateTrainingResult
);
// ==================================================================================
//get Single Training Result Information by student   EDIT_R
router.get(
  `${TrainingResult.getSingleTrainingResultByStudent}`,
  valid(vSchema.getSingleTrainingResult),
  isAuth([roles.stu]),
  trc.getSingleTrainingResult
);

//get Single Training Result Information by instructor    EDIT_R
router.get(
  `${TrainingResult.getSingleTrainingResultByInstructor}`,
  valid(vSchema.getSingleTrainingResult),
  isAuth([roles.instructor]),
  trc.getSingleTrainingResult
);

//get Single Training Result Information by Admin    EDIT_R
router.get(
  `${TrainingResult.getSingleTrainingResultByAdmin}`,
  valid(vSchema.getSingleTrainingResult),
  isAuth([roles.admin]),
  trc.getSingleTrainingResult
);
// =============================================================================================
//get Single Training Result Information by instructor    EDIT_R
router.get(
  `${TrainingResult.SearchTrainingResultByInstructor}`,
  valid(vSchema.SearchTrainingResult),
  isAuth([roles.instructor]),
  trc.SearchTrainingResult
);

//get Search Training Result Information by Admin        EDIT_R
router.get(
  `${TrainingResult.SearchTrainingResultByAdmin}`,
  valid(vSchema.SearchTrainingResult),
  isAuth([roles.admin]),
  trc.SearchTrainingResult
);

//get Search Training Result Information by student      EDIT_R
router.get(
  `${TrainingResult.SearchTrainingResultByStudent}`,
  valid(vSchema.SearchTrainingResult),
  isAuth([roles.stu]),
  trc.SearchTrainingResult
);
export default router;

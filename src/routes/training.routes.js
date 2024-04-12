import { Router } from "express";
import * as tc from "../controllers/training/training.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/training/trainigvalid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
const router = Router();

router.post(
  "/addtraining",
  valid(vSchema.addtrain),
  isAuth([roles.admin]),
  tc.addtrain
);

router.get(
  "/alltraining",
  valid(vSchema.alltrain),
  isAuth([roles.admin, roles.stu, roles.instructor]),
  tc.alltraining
);

router.put(
  "/updatetraining",
  valid(vSchema.updatetrain),
  isAuth([roles.admin]),
  tc.updatetraining
);

router.delete(
  "/deletetraining",
  valid(vSchema.deletetrain),
  isAuth([roles.admin]),
  tc.deletetrain
);

//upload one or more image
router.post(
  "/Add/images",
  multerCloud(allowedExtensions.Image).array("TrainingImage", 3),
  valid(vSchema.AddTrainingImg),
  isAuth([roles.admin]),
  tc.AddTrainingImg
);

router.patch(
  "/delete/images",
  valid(vSchema.deleteTrainingImg),
  isAuth([roles.admin]),
  tc.deleteTrainingImg
);

router.get(
  "/info",
  valid(vSchema.TrainInfo),
  isAuth([roles.admin, roles.instructor, roles.stu]),
  tc.TrainingInfo
);
export default router;

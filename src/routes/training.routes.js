import { Router } from "express";
import * as tc from "../controllers/training/training.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/training/trainigvalid.js";
import { isAuth, roles } from "../middleware/auth.js";
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
  isAuth([roles.admin]),
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
export default router;

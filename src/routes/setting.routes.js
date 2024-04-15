import { Router } from "express";
import * as sc from "../controllers/setting/setting.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/setting/setting.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { routes } from "../utils/routes.path.js";
const router = Router();

// ==================================================================

//create admin
const { setting } = routes;
router.put(
  `${setting.updateSetting}`,
  valid(vSchema.updateSetting),
  isAuth([roles.super]),
  sc.updateSetting
);

router.delete(
  `${setting.deleteSetting}`,
  valid(vSchema.deleteSetting),
  isAuth([roles.super]),
  sc.deleteSetting
);

router.get(
  `${setting.ViewSetting}`,
  isAuth([roles.super, roles.admin]),
  sc.ViewSetting
);

export default router;

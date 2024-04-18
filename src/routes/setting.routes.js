import { Router } from "express";
import * as sc from "../controllers/setting/setting.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/setting/setting.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();

// ==================================================================

//create admin
const { setting } = routes;
router.put(
  `${setting.updateSetting}`,
  limiter({limit:100,Mintute:24*60}),
  valid(vSchema.updateSetting),
  isAuth([roles.super]),
  sc.updateSetting
);

router.delete(
  `${setting.deleteSetting}`,
  limiter({limit:100,Mintute:24*60}),
  valid(vSchema.deleteSetting),
  isAuth([roles.super]),
  sc.deleteSetting
);

router.get(
  `${setting.ViewSetting}`,
  limiter({limit:100,Mintute:24*60}),
  isAuth([roles.super]),
  sc.ViewSetting
);
router.get(
  `${setting.ViewSettingAdmin}`,
  limiter({limit:30,Mintute:12*60}),
  isAuth([roles.admin]),
  sc.ViewSetting
);

export default router;

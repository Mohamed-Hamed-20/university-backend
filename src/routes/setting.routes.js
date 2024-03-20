import { Router } from "express";
import * as sc from "../controllers/setting/setting.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/setting/setting.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();


// ==================================================================

//create admin

router.put(
  "/update",
  valid(vSchema.updateSetting),
  isAuth([roles.super]),
  sc.updateSetting
);

router.delete(
  "/delete",
  valid(vSchema.deleteSetting),
  isAuth([roles.super]),
  sc.deleteSetting
);

router.get(
  "/ViewSetting",
  valid(vSchema.searchAdmin),
  isAuth([roles.super, roles.admin]),
  sc.ViewSetting
);

export default router;

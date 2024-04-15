import { Router } from "express";
import * as ac from "../controllers/admin/admin.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/admin/admin.valid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const {Admin} = routes

//login admin SuperAdmins
router.post(`${Admin.login}`, valid(vSchema.login), ac.login);

router.get(`${Admin.getinfoAdmin}`, isAuth([roles.admin]), ac.Getuser);
router.get(`${Admin.getinfoSuper}`, isAuth([roles.super]), ac.Getuser);
// ==================================================================

//create admin

router.post(
  `${Admin.createAdmin}`,
    valid(vSchema.CreateAdmin),
  isAuth([roles.super]),
  ac.CreateAdmin
);

router.put(
  `${Admin.updateAdmin}`,
  valid(vSchema.updateAdmin),
  isAuth([roles.super]),
  ac.updateAdmin
);

router.delete(
  `${Admin.deleteAdmin}`,
  valid(vSchema.deleteAdmin),
  isAuth([roles.super]),
  ac.deleteAdmin
);

router.get(
  `${Admin.searchAdmin}`,
  valid(vSchema.searchAdmin),
  isAuth([roles.super]),
  ac.searchAdmin
);

//=================================================================================================
//upload one or more image
router.post(
  `${Admin.AddImgBySuper}`,
  multerCloud(allowedExtensions.Image).single("adminImage"),
  valid(vSchema.AddAdminImg),
  isAuth([roles.super]),
  ac.AddAdminImg
);


//   EDIT_R     admin
router.post(
  `${Admin.AddImgByAdmin}`,
  multerCloud(allowedExtensions.Image).single("adminImage"),
  isAuth([roles.admin]),
  ac.AddAdminImg
);

//   EDIT_R     admin
router.patch(`${Admin.deleteImgByAdmin}`,isAuth([roles.admin]), ac.deleteAdminImg);

router.patch(
  `${Admin.AddImgByAdmin}`,
  valid(vSchema.deleteAdminImg),
  isAuth([roles.super]),
  ac.deleteAdminImg
);



router.get( `${Admin.dashboardAdmin}`,isAuth([roles.admin]), ac.dashboard);
export default router;

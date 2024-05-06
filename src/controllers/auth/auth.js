import { adminModel } from "../../../DB/models/admin.model.js";
import { InstructorModel } from "../../../DB/models/instructor.model.js";
import { roles } from "../../middleware/auth.js";
import { decryptData, encryptData } from "../../utils/crypto.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { hashpassword } from "../../utils/hashpassword.js";
import { routes } from "../../utils/routes.path.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { confirmEmailTemplet } from "../../utils/templetHtml.js";
import { generateToken, verifyToken } from "../../utils/Token.js";
const { auth } = routes;
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email, myRole } = req.body;

  let user;
  if (roles.instructor == myRole) {
    user = await InstructorModel.findOne({ email })
      .lean()
      .select("_id email role");
  } else {
    user = await adminModel.findOne({ email }).lean().select("_id email role");
  }

  // email not found
  if (!user) {
    return next(new Error("Invaild Email not found", { cause: 404 }));
  }
  console.log(user);
  const token = await generateToken({
    payload: { email: user.email, userId: user._id, role: user.role },
    signature: process.env.ForgetPassword,
    expiresIn: "7m",
  });
  console.log({ token });
  const encrypted = await encryptData({
    data: token,
    password: process.env.ForgetPassword,
  });
  console.log({ encrypted });
  const to = user.email;
  const subject = "This message to Reset you Password";
  const link = `${req.protocol}://${req.headers.host}${auth._id}${auth.Resetpass}/${encrypted}`;

  const html = `${await confirmEmailTemplet(link)}`;
  const isSend = await sendEmail({ to, subject, html });
  console.log({ isSend });
  if (!isSend) {
    return next(new Error("Faild to send confirm Email", { cause: 500 }));
  }

  return res.json({ message: "Reset password send successfully", user });
});

export const ResetPassword = asyncHandler(async (req, res, next) => {
  const { key, password, confrimPassword } = req.body;
  console.log({ key, password, confrimPassword });
  const token = await decryptData({
    encryptedData: key,
    password: process.env.ForgetPassword,
  });

  console.log(token);
  const data = verifyToken({
    token: token,
    signature: process.env.ForgetPassword,
  });

  console.log(data);

  if (!data.email || !data.userId || !data.role) {
    return next(new Error("Invaild Data", { cause: 400 }));
  }

  const hashpass = hashpassword({
    password: password,
    saltRound: process.env.salt_Round || 8,
  });

  let updateUser;
  if (roles.instructor == data.role) {
    updateUser = await InstructorModel.findByIdAndDelete(
      { _id: data.userId },
      { password: hashpass },
      { new: true }
    );
  } else {
    updateUser = await adminModel.findByIdAndDelete(
      { _id: data.userId },
      { password: hashpass },
      { new: true }
    );
  }

  return res.json({ message: "password reset successfully" });
});
